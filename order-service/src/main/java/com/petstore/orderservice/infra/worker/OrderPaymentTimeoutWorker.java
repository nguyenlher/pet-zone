package com.petstore.orderservice.infra.worker;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

import org.redisson.api.RAtomicLong;
import org.redisson.api.RBlockingQueue;
import org.redisson.api.RDelayedQueue;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Component;

import com.petstore.orderservice.domain.model.Order;
import com.petstore.orderservice.domain.model.enums.OrderStatus;
import com.petstore.orderservice.domain.publisher.OrderPublisher;
import com.petstore.orderservice.domain.repository.OrderRepository;
import com.petstore.orderservice.domain.service.OrderPersistenceService;
import com.petstore.orderservice.domain.service.impl.OrderDelayQueueServiceImpl;
import com.petstore.orderservice.utils.properties.OrderTimeoutProperties;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Background worker consuming expired orders from Redis Delay Queue and executing cancellation.
 * Features distributed locking against race conditions and automatic re-queuing on transient errors.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class OrderPaymentTimeoutWorker {

    public static final String ORDER_LOCK_PREFIX = "order:lock:";
    public static final String RETRY_COUNTER_PREFIX = "order:timeout:retry:";

    private final RedissonClient redissonClient;
    private final OrderRepository orderRepository;
    private final OrderPersistenceService orderPersistenceService;
    private final OrderPublisher orderPublisher;
    private final OrderDelayQueueServiceImpl orderDelayQueueService;
    private final OrderTimeoutProperties timeoutProperties;

    private ExecutorService executorService;
    private volatile boolean running = true;

    @PostConstruct
    public void startWorker() {
        executorService = Executors.newSingleThreadExecutor(r -> {
            Thread thread = new Thread(r, "order-timeout-delay-worker");
            thread.setDaemon(true);
            return thread;
        });

        executorService.submit(this::processTimeoutQueue);
        log.info("OrderPaymentTimeoutWorker initialized and listening to Redis Delay Queue: {}",
                OrderDelayQueueServiceImpl.ORDER_PAYMENT_TIMEOUT_QUEUE);
    }

    private void processTimeoutQueue() {
        RBlockingQueue<String> queue = orderDelayQueueService.getDestinationQueue();

        while (running && !Thread.currentThread().isInterrupted()) {
            try {
                // Poll with timeout to allow graceful shutdown without hanging
                String orderIdStr = queue.poll(5, TimeUnit.SECONDS);
                if (orderIdStr != null && !orderIdStr.trim().isEmpty()) {
                    handleTimeoutOrder(UUID.fromString(orderIdStr));
                }
            } catch (InterruptedException e) {
                log.info("OrderPaymentTimeoutWorker thread interrupted, stopping...");
                Thread.currentThread().interrupt();
                break;
            } catch (Exception e) {
                log.error("Unexpected error in OrderPaymentTimeoutWorker loop", e);
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        }
    }

    /**
     * Handle timeout cancellation for a specific order with distributed locking and retry.
     *
     * @param orderId the order identifier
     */
    public void handleTimeoutOrder(UUID orderId) {
        log.info("Processing expired payment timeout from Redis Delay Queue for order: {}", orderId);
        RLock lock = redissonClient.getLock(ORDER_LOCK_PREFIX + orderId);
        boolean acquired = false;

        try {
            // Wait up to 5 seconds to acquire lock, hold for at most 15 seconds to avoid deadlock
            acquired = lock.tryLock(5, 15, TimeUnit.SECONDS);
            if (!acquired) {
                log.warn("Could not acquire distributed lock for order: {}. Re-queueing with retry delay", orderId);
                scheduleRetry(orderId);
                return;
            }

            processOrderCancellation(orderId);
            clearRetryCounter(orderId);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.warn("Interrupted while waiting for distributed lock on order: {}", orderId);
            scheduleRetry(orderId);
        } catch (Exception e) {
            log.error("Failed to cancel order {} during payment timeout execution. Scheduling retry.", orderId, e);
            scheduleRetry(orderId);
        } finally {
            if (acquired && lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }

    /**
     * Executes order cancellation logic inside protected lock.
     */
    private void processOrderCancellation(UUID orderId) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            log.warn("Order not found during timeout processing: {}", orderId);
            return;
        }

        Order order = orderOpt.get();
        // Idempotency: only cancel if order is still waiting for payment
        if (order.getStatus() == OrderStatus.PENDING_PAYMENT) {
            order.setStatus(OrderStatus.CANCELLED);
            order.setUpdatedAt(LocalDateTime.now());
            orderPersistenceService.saveOrder(order);

            // Publish compensating event so inventory/stock is restored in pet-service
            orderPublisher.publishOrderCancelled(
                    order,
                    "Payment timeout (" + timeoutProperties.getPaymentTimeoutMinutes() + " minutes) - order cancelled via Redis Delay Queue"
            );
            log.info("Successfully cancelled order {} due to payment timeout via Redis Delay Queue", orderId);
        } else {
            log.info("Order {} is already in status {}, skipping timeout cancellation", orderId, order.getStatus());
        }
    }

    /**
     * Re-queues the order back into Redis Delay Queue upon unexpected transient failures.
     */
    private void scheduleRetry(UUID orderId) {
        try {
            int maxAttempts = timeoutProperties.getMaxRetryAttempts();
            long retryDelay = timeoutProperties.getRetryDelayMinutes();

            String retryKey = RETRY_COUNTER_PREFIX + orderId;
            RAtomicLong retryCounter = redissonClient.getAtomicLong(retryKey);
            long attempts = retryCounter.incrementAndGet();
            retryCounter.expire(Duration.ofMinutes(30));

            if (attempts <= maxAttempts) {
                log.warn("Re-queueing order {} for timeout retry attempt {}/{} in {} minute(s)",
                        orderId, attempts, maxAttempts, retryDelay);
                RDelayedQueue<String> delayedQueue = orderDelayQueueService.getDelayedQueue();
                delayedQueue.offer(orderId.toString(), retryDelay, TimeUnit.MINUTES);
            } else {
                log.error("CRITICAL: Exceeded maximum retry attempts ({}) for order payment timeout: {}. Manual intervention required.",
                        maxAttempts, orderId);
                clearRetryCounter(orderId);
            }
        } catch (Exception e) {
            log.error("Failed to re-queue order {} for retry", orderId, e);
        }
    }

    private void clearRetryCounter(UUID orderId) {
        try {
            redissonClient.getAtomicLong(RETRY_COUNTER_PREFIX + orderId).delete();
        } catch (Exception e) {
            log.debug("Failed to delete retry counter for order: {}", orderId);
        }
    }

    @PreDestroy
    public void stopWorker() {
        running = false;
        if (executorService != null) {
            executorService.shutdownNow();
        }
        log.info("OrderPaymentTimeoutWorker gracefully stopped");
    }
}

package com.petstore.orderservice.domain.service.impl;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

import jakarta.annotation.PostConstruct;

import org.redisson.api.RBlockingQueue;
import org.redisson.api.RDelayedQueue;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Service;

import com.petstore.orderservice.domain.service.OrderDelayQueueService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Implementation of OrderDelayQueueService backed by Redisson RDelayedQueue.
 * Caches queue references for high performance and reliable lifecycle management.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderDelayQueueServiceImpl implements OrderDelayQueueService {

    public static final String ORDER_PAYMENT_TIMEOUT_QUEUE = "order:payment:timeout:queue";

    private final RedissonClient redissonClient;

    // Cached queue references to prevent recreation overhead
    private RBlockingQueue<String> destinationQueue;
    private RDelayedQueue<String> delayedQueue;

    @PostConstruct
    public void init() {
        this.destinationQueue = redissonClient.getBlockingQueue(ORDER_PAYMENT_TIMEOUT_QUEUE);
        this.delayedQueue = redissonClient.getDelayedQueue(destinationQueue);
        log.info("Initialized and cached Redisson RDelayedQueue for payment timeouts: {}", ORDER_PAYMENT_TIMEOUT_QUEUE);
    }

    @Override
    public void schedulePaymentTimeout(UUID orderId, long timeoutMinutes) {
        if (orderId == null) {
            log.warn("Cannot schedule payment timeout for null orderId");
            return;
        }

        try {
            delayedQueue.offer(orderId.toString(), timeoutMinutes, TimeUnit.MINUTES);
            log.info("Successfully scheduled payment timeout in Redis Delay Queue for order: {} ({} minutes)", orderId, timeoutMinutes);
        } catch (Exception e) {
            log.error("Failed to schedule payment timeout in Redis Delay Queue for order: {}", orderId, e);
        }
    }

    @Override
    public void cancelPaymentTimeout(UUID orderId) {
        if (orderId == null) {
            return;
        }

        try {
            boolean removed = delayedQueue.remove(orderId.toString());
            if (removed) {
                log.info("Cancelled payment timeout from Redis Delay Queue for order: {}", orderId);
            }
        } catch (Exception e) {
            log.error("Failed to cancel payment timeout from Redis Delay Queue for order: {}", orderId, e);
        }
    }

    public RBlockingQueue<String> getDestinationQueue() {
        return destinationQueue;
    }

    public RDelayedQueue<String> getDelayedQueue() {
        return delayedQueue;
    }
}

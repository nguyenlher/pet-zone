package com.petstore.orderservice.infra.scheduler;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.petstore.orderservice.domain.model.Order;
import com.petstore.orderservice.domain.model.enums.OrderStatus;
import com.petstore.orderservice.domain.publisher.OrderPublisher;
import com.petstore.orderservice.domain.repository.OrderRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Scheduler to handle payment timeout as part of Saga pattern
 * Automatically cancels orders that are pending payment for too long
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentTimeoutScheduler {

    private final OrderRepository orderRepository;
    private final OrderPublisher orderPublisher;
    
    // Payment timeout: 30 minutes
    private static final int PAYMENT_TIMEOUT_MINUTES = 30;

    /**
     * Run every 5 minutes to check for expired pending payments
     */
    @Scheduled(fixedRate = 300000) // 5 minutes
    @Transactional
    public void cancelExpiredPendingPayments() {
        LocalDateTime cutoffTime = LocalDateTime.now().minusMinutes(PAYMENT_TIMEOUT_MINUTES);
        
        List<Order> expiredOrders = orderRepository.findByStatusAndCreatedAtBefore(
                OrderStatus.PENDING_PAYMENT, 
                cutoffTime
        );
        
        if (!expiredOrders.isEmpty()) {
            log.info("Found {} orders with expired payment timeout", expiredOrders.size());
            
            for (Order order : expiredOrders) {
                try {
                    order.setStatus(OrderStatus.CANCELLED);
                    order.setUpdatedAt(LocalDateTime.now());
                    orderRepository.save(order);
                    
                    // Publish cancellation event for compensating transactions
                    orderPublisher.publishOrderCancelled(
                            order, 
                            "Payment timeout - order cancelled after " + PAYMENT_TIMEOUT_MINUTES + " minutes"
                    );
                    
                    log.info("Cancelled order {} due to payment timeout", order.getId());
                } catch (Exception e) {
                    log.error("Failed to cancel expired order: {}", order.getId(), e);
                }
            }
        }
    }
}

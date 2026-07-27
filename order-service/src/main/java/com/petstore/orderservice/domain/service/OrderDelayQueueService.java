package com.petstore.orderservice.domain.service;

import java.util.UUID;

/**
 * Service to manage order payment timeout delay queue operations using Redis.
 */
public interface OrderDelayQueueService {

    /**
     * Schedule payment timeout for a given order.
     *
     * @param orderId the unique order identifier
     * @param timeoutMinutes duration in minutes before timeout triggers
     */
    void schedulePaymentTimeout(UUID orderId, long timeoutMinutes);

    /**
     * Cancel an existing payment timeout schedule (e.g. when payment succeeds or is cancelled early).
     *
     * @param orderId the unique order identifier
     */
    void cancelPaymentTimeout(UUID orderId);
}

package com.petstore.orderservice.utils.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

/**
 * Configuration properties for order payment timeout and worker retry mechanism.
 */
@Component
@ConfigurationProperties(prefix = "app.order.timeout")
@Getter
@Setter
public class OrderTimeoutProperties {

    /**
     * Timeout duration in minutes before an unpaid order is cancelled.
     */
    private long paymentTimeoutMinutes = 15;

    /**
     * Maximum retry attempts when encountering transient errors during timeout processing.
     */
    private int maxRetryAttempts = 3;

    /**
     * Delay in minutes between retry attempts.
     */
    private long retryDelayMinutes = 1;
}

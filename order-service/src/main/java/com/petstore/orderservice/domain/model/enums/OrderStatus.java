package com.petstore.orderservice.domain.model.enums;

public enum OrderStatus {
    PENDING_PAYMENT,
    PENDING,
    CONFIRM,
    SHIPPED,
    DELIVERED,
    CANCELLED,
    PAYMENT_FAILED
}

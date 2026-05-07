package com.petstore.orderservice.domain.model.enums;

public enum OrderStatus {
    PENDING_PAYMENT,  // Chờ thanh toán (VNPay)
    PENDING,          // Đã thanh toán, chờ xử lý
    CONFIRM,
    SHIPPED,
    DELIVERED,
    CANCELLED,
    PAYMENT_FAILED    // Thanh toán thất bại
}

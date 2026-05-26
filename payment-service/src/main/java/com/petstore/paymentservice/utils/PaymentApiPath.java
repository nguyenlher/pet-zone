package com.petstore.paymentservice.utils;

public class PaymentApiPath {
    // Base paths for authentication levels
    public static final String PUBLIC_BASE = "/public";
    public static final String PRIVATE_BASE = "/private";
    
    // Public Payment APIs (for frontend/client - JWT required)
    public static final String PAYMENT_PUBLIC_BASE = "/public/payments";
    public static final String PAYMENT_CREATE = "";
    public static final String PAYMENT_CALLBACK = "/callback/{paymentMethod}";
    public static final String PAYMENT_IPN = "/ipn/{paymentMethod}";
    
    // Private Payment APIs (for service-to-service communication - X-API-KEY required)
    public static final String PAYMENT_PRIVATE_BASE = "/private/payments";
    public static final String PAYMENT_BY_ID = "/{paymentId}";
    public static final String PAYMENT_BY_ORDER = "/order/{orderId}";
    public static final String PAYMENT_UPDATE_STATUS = "/{paymentId}/status";

    private PaymentApiPath() {
        // Private constructor to prevent instantiation
    }
}

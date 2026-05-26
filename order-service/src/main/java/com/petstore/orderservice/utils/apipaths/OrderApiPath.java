package com.petstore.orderservice.utils.apipaths;

public class OrderApiPath {
    // Base paths for authentication levels
    public static final String PUBLIC_BASE = "/public";
    public static final String PRIVATE_BASE = "/private";
    
    // Public Order APIs (for frontend/client - JWT required)
    public static final String ORDER_BASE = "/public/order";
    public static final String ORDER_CREATE = "/create";
    public static final String ORDER_CANCEL = "/cancel";
    
    // Private Order APIs (for service-to-service communication - X-API-KEY required)
    public static final String PRIVATE_ORDER_BASE = "/private/orders";
}

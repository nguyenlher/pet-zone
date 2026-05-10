package com.petstore.orderservice.utils.apipaths;

public class OrderApiPath {
    // Public Order APIs (for frontend/client)
    public static final String ORDER_BASE = "/api/public/order";
    public static final String ORDER_CREATE = "/create";
    public static final String ORDER_CANCEL = "/cancel";
    
    // Private Order APIs (for service-to-service communication)
    public static final String PRIVATE_ORDER_BASE = "/api/private/orders";
}

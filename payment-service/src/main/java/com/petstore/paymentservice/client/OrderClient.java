package com.petstore.paymentservice.client;

import java.util.UUID;

public interface OrderClient {
    OrderInfo getOrder(UUID orderId);
}

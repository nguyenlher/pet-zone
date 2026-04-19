package com.petstore.paymentservice.domain.client;

import java.util.UUID;

public interface OrderClient {
    OrderInfo getOrder(UUID orderId);
}

package com.petstore.orderservice.domain.publisher;

import com.petstore.orderservice.domain.model.Order;

public interface OrderPublisher {
    void publishOrderCreated(Order order);
    void publishOrderConfirmed(Order order);
    void publishOrderCancelled(Order order, String reason);
}

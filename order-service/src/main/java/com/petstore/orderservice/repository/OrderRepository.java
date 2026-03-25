package com.petstore.orderservice.repository;

import java.util.Optional;
import java.util.UUID;

import com.petstore.orderservice.model.Order;

public interface OrderRepository {
    Order save(Order order);
    Optional<Order> findById(UUID orderId);
}

package com.petstore.orderservice.domain.repository;

import java.util.Optional;
import java.util.UUID;

import com.petstore.orderservice.domain.model.Order;

public interface OrderRepository {
    Order save(Order order);
    Optional<Order> findById(UUID orderId);
}

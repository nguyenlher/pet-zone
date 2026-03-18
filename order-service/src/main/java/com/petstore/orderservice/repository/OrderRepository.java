package com.petstore.orderservice.repository;

import com.petstore.orderservice.model.Order;

import java.util.Optional;
import java.util.UUID;

public interface OrderRepository {
    Optional<Order> findById(UUID orderId);
}

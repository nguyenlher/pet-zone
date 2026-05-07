package com.petstore.orderservice.domain.repository;

import java.util.Optional;
import java.util.UUID;

import com.petstore.orderservice.domain.model.Order;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderRepository {
    Order save(Order order);
    Optional<Order> findById(UUID orderId);
    Page<Order> findAll(Pageable pageable);
}

package com.petstore.orderservice.domain.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.petstore.orderservice.domain.model.Order;
import com.petstore.orderservice.domain.model.enums.OrderStatus;

public interface OrderRepository {
    Order save(Order order);
    Optional<Order> findById(UUID orderId);
    Page<Order> findByUserId(UUID userId, Pageable pageable);
    Page<Order> findAll(Pageable pageable);
    void deleteById(UUID orderId);
    
    /**
     * Find orders by status and created before a certain time
     * Used for payment timeout handling in Saga pattern
     */
    List<Order> findByStatusAndCreatedAtBefore(OrderStatus status, LocalDateTime cutoffTime);
}

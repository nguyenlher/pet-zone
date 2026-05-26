package com.petstore.orderservice.infra.repository.jpa;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.petstore.orderservice.domain.model.enums.OrderStatus;
import com.petstore.orderservice.infra.entity.OrderEntity;

public interface JpaOrderRepository extends JpaRepository<OrderEntity, UUID> {
    Page<OrderEntity> findByUserId(UUID userId, Pageable pageable);
    
    /**
     * Find orders by status and created before a certain time
     * Used for payment timeout handling in Saga pattern
     */
    List<OrderEntity> findByStatusAndCreatedAtBefore(OrderStatus status, LocalDateTime cutoffTime);
}

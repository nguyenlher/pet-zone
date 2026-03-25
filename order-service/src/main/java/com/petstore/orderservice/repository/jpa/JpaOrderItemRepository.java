package com.petstore.orderservice.repository.jpa;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.petstore.orderservice.entity.OrderItemEntity;

public interface JpaOrderItemRepository extends JpaRepository<OrderItemEntity, UUID> {
}

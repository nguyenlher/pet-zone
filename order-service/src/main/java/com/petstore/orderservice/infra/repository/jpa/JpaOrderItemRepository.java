package com.petstore.orderservice.infra.repository.jpa;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.petstore.orderservice.infra.entity.OrderItemEntity;

public interface JpaOrderItemRepository extends JpaRepository<OrderItemEntity, UUID> {
}

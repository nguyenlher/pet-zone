package com.petstore.orderservice.repository.jpa;

import com.petstore.orderservice.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface JpaOrderRepository extends JpaRepository<OrderEntity, UUID> {
}

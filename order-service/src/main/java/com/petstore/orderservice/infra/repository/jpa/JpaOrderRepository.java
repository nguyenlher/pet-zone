package com.petstore.orderservice.infra.repository.jpa;

import com.petstore.orderservice.infra.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface JpaOrderRepository extends JpaRepository<OrderEntity, UUID> {
}

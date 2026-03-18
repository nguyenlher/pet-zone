package com.petstore.orderservice.repository.impl;

import com.petstore.orderservice.entity.OrderEntity;
import com.petstore.orderservice.mapper.OrderMapper;
import com.petstore.orderservice.model.Order;
import com.petstore.orderservice.repository.OrderRepository;
import com.petstore.orderservice.repository.jpa.JpaOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class OrderRepositoryImpl implements OrderRepository {
    private final OrderMapper orderMapper;
    private final JpaOrderRepository jpaOrderRepository;

    @Override
    public Optional<Order> findById(UUID orderId) {
        Optional<OrderEntity> entityOpt = jpaOrderRepository.findById(orderId);
        return entityOpt.map(orderMapper::toDomain);
    }
}

package com.petstore.orderservice.infra.repository.impl;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Repository;

import com.petstore.orderservice.infra.entity.OrderEntity;
import com.petstore.orderservice.infra.mapper.OrderMapper;
import com.petstore.orderservice.domain.model.Order;
import com.petstore.orderservice.domain.repository.OrderRepository;
import com.petstore.orderservice.infra.repository.jpa.JpaOrderRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class OrderRepositoryImpl implements OrderRepository {
    private final OrderMapper orderMapper;
    private final JpaOrderRepository jpaOrderRepository;

    @Override
    public Order save(Order order) {
        OrderEntity entity = orderMapper.toEntity(order);
        return orderMapper.toDomain(jpaOrderRepository.save(entity));
    }

    @Override
    public Optional<Order> findById(UUID orderId) {
        Optional<OrderEntity> entityOpt = jpaOrderRepository.findById(orderId);
        return entityOpt.map(orderMapper::toDomain);
    }
}

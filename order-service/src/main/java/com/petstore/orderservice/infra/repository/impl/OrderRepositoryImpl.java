package com.petstore.orderservice.infra.repository.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.petstore.orderservice.domain.model.Order;
import com.petstore.orderservice.domain.model.enums.OrderStatus;
import com.petstore.orderservice.domain.repository.OrderRepository;
import com.petstore.orderservice.infra.entity.OrderEntity;
import com.petstore.orderservice.infra.mapper.OrderMapper;
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
        if (entity.getItems() != null) {
            entity.getItems().forEach(item -> item.setOrder(entity));
        }
        if (entity.getShippingDetail() != null) {
            entity.getShippingDetail().setOrder(entity);
        }
        return orderMapper.toDomain(jpaOrderRepository.save(entity));
    }

    @Override
    public Optional<Order> findById(UUID orderId) {
        Optional<OrderEntity> entityOpt = jpaOrderRepository.findById(orderId);
        return entityOpt.map(orderMapper::toDomain);
    }

    @Override
    public Page<Order> findAll(Pageable pageable) {
        return jpaOrderRepository.findAll(pageable).map(orderMapper::toDomain);
    }

    @Override
    public Page<Order> findByUserId(UUID userId, Pageable pageable) {
        return jpaOrderRepository.findByUserId(userId, pageable).map(orderMapper::toDomain);
    }

    @Override
    public void deleteById(UUID orderId) {
        jpaOrderRepository.deleteById(orderId);
    }

    @Override
    public List<Order> findByStatusAndCreatedAtBefore(OrderStatus status, LocalDateTime cutoffTime) {
        return jpaOrderRepository.findByStatusAndCreatedAtBefore(status, cutoffTime)
                .stream()
                .map(orderMapper::toDomain)
                .collect(Collectors.toList());
    }
}

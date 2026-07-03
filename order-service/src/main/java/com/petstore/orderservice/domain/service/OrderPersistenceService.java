package com.petstore.orderservice.domain.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.petstore.orderservice.domain.model.Order;
import com.petstore.orderservice.domain.repository.OrderRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Handles database transaction boundaries for Order persistence.
 * Separated from OrderServiceImpl to ensure network I/O (REST calls to pet-service)
 * is kept strictly outside of the database transaction.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderPersistenceService {

    private final OrderRepository orderRepository;

    @Transactional
    public Order saveOrder(Order order) {
        log.debug("Persisting order to database in isolated transaction for userId: {}", order.getUserId());
        return orderRepository.save(order);
    }
}

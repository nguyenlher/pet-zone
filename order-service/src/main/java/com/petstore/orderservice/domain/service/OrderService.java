package com.petstore.orderservice.domain.service;

import java.util.List;
import java.util.UUID;

import com.petstore.orderservice.domain.model.Order;
import com.petstore.orderservice.domain.model.OrderItem;

public interface OrderService {
    Order createOrder(UUID userId, List<OrderItem> items, String discountCode);
    Order cancelOrder(UUID orderId, String reason);
}

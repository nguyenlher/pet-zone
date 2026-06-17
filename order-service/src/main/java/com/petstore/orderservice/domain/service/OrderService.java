package com.petstore.orderservice.domain.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.petstore.orderservice.domain.model.Order;
import com.petstore.orderservice.domain.model.OrderItem;
import com.petstore.orderservice.domain.model.OrderShippingDetail;

public interface OrderService {
    Order createOrder(UUID userId, List<OrderItem> items, OrderShippingDetail shippingDetail, String discountCode);
    Order cancelOrder(UUID orderId, String reason);
    Order getOrderById(UUID orderId);
    Page<Order> getUserOrders(UUID userId, Pageable pageable);
    Page<Order> getAllOrders(Pageable pageable);
}

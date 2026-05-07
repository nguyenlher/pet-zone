package com.petstore.orderservice.api.controller;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.petstore.orderservice.api.dto.response.CreateOrderResponse;
import com.petstore.orderservice.api.dto.response.OrderItemResponse;
import com.petstore.orderservice.domain.model.Order;
import com.petstore.orderservice.domain.repository.OrderRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Private Order Controller for inter-service communication
 * Used by other microservices (payment-service, etc.) to get order information
 */
@RestController
@RequestMapping("/private/orders")
@RequiredArgsConstructor
@Slf4j
public class PrivateOrderController {

    private final OrderRepository orderRepository;

    @GetMapping("/{id}")
    public ResponseEntity<CreateOrderResponse> getOrderById(@PathVariable UUID id) {
        log.info("Private API: Getting order by id: {}", id);
        
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));

        CreateOrderResponse response = toCreateOrderResponse(order);
        return ResponseEntity.ok(response);
    }

    private CreateOrderResponse toCreateOrderResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .id(item.getPetId())
                        .name(item.getPetName())
                        .quantity(item.getQuantity())
                        .price(item.getUnitPrice())
                        .subtotalPrice(item.getSubtotalAmount())
                        .build())
                .collect(Collectors.toList());

        return CreateOrderResponse.builder()
                .orderId(order.getId())
                .userId(order.getUserId())
                .subtotalAmount(order.getSubtotalAmount())
                .discountAmount(order.getDiscountAmount())
                .shippingFee(order.getShippingFee())
                .totalAmount(order.getTotalAmount())
                .orderStatus(order.getStatus())
                .items(itemResponses)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}

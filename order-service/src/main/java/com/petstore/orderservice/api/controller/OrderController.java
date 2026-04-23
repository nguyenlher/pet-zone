package com.petstore.orderservice.api.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.petstore.orderservice.api.dto.request.CancelOrderRequest;
import com.petstore.orderservice.api.dto.request.CreateOrderRequest;
import com.petstore.orderservice.api.dto.response.CancelOrderResponse;
import com.petstore.orderservice.api.dto.response.CreateOrderResponse;
import com.petstore.orderservice.api.dto.response.OrderItemResponse;
import com.petstore.orderservice.domain.model.Order;
import com.petstore.orderservice.domain.model.OrderItem;
import com.petstore.orderservice.domain.service.OrderService;
import com.petstore.orderservice.utils.apipaths.OrderApiPath;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(OrderApiPath.ORDER_BASE)
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping(OrderApiPath.ORDER_CREATE)
    public ResponseEntity<CreateOrderResponse> createOrder(@RequestBody CreateOrderRequest request) {
        List<OrderItem> items = request.getItems().stream()
                .map(item -> OrderItem.builder()
                        .petId(item.getPetId())
                        .quantity(item.getQuantity())
                        .build())
                .collect(Collectors.toList());

        Order order = orderService.createOrder(request.getUserId(), items, request.getDiscountCode());

        return ResponseEntity.ok(toCreateOrderResponse(order));
    }

    @PostMapping(OrderApiPath.ORDER_CANCEL)
    public ResponseEntity<CancelOrderResponse> cancelOrder(@RequestBody CancelOrderRequest request) {
        Order order = orderService.cancelOrder(request.getOrderId(), request.getReason());

        CancelOrderResponse response = CancelOrderResponse.builder()
                .orderId(order.getId())
                .orderStatus(order.getStatus())
                .updatedAt(order.getUpdatedAt())
                .message("Order canceled successfully")
                .build();

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

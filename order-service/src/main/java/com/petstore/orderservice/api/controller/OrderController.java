package com.petstore.orderservice.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.petstore.orderservice.api.dto.request.CancelOrderRequest;
import com.petstore.orderservice.api.dto.request.CreateOrderRequest;
import com.petstore.orderservice.domain.service.OrderService;
import com.petstore.orderservice.utils.apipaths.OrderApiPath;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(OrderApiPath.ORDER_BASE)
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping(OrderApiPath.ORDER_CREATE)
    public ResponseEntity<String> createOrder(@RequestParam CreateOrderRequest request) {
        orderService.createOrder(request);
        return ResponseEntity.ok("Order created successfully");
    }

    @PostMapping
    public ResponseEntity<String> cancelOrder(@RequestParam CancelOrderRequest request) {
        orderService.cancelOrder(request);
        return ResponseEntity.ok("Order cancelled successfully");
    }
}

package com.petstore.orderservice.service;

import com.petstore.orderservice.dto.request.CreateOrderRequest;
import com.petstore.orderservice.dto.response.CreateOrderResponse;

public interface OrderService {
    CreateOrderResponse createOrder(CreateOrderRequest request);
}

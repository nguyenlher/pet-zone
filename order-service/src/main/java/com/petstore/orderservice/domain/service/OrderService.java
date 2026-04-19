package com.petstore.orderservice.domain.service;

import com.petstore.orderservice.api.dto.request.CancelOrderRequest;
import com.petstore.orderservice.api.dto.request.CreateOrderRequest;
import com.petstore.orderservice.api.dto.response.CancelOrderResponse;
import com.petstore.orderservice.api.dto.response.CreateOrderResponse;

public interface OrderService {
    CreateOrderResponse createOrder(CreateOrderRequest request);
    CancelOrderResponse cancelOrder(CancelOrderRequest request);
}

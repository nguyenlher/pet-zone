package com.petstore.paymentservice.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.petstore.paymentservice.api.dto.request.CreatePaymentRequest;
import com.petstore.paymentservice.api.dto.response.PaymentResponse;
import com.petstore.paymentservice.domain.service.PaymentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Private Payment Controller for inter-service communication
 * Used by other microservices (order-service, etc.) to create payments
 */
@RestController
@RequestMapping("/private/payments")
@RequiredArgsConstructor
@Slf4j
public class PrivatePaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentResponse> createPayment(@RequestBody CreatePaymentRequest request) {
        log.info("Private API: Creating payment for order: {}", request.getOrderId());
        
        // For inter-service calls, use a default IP or get from request context
        String ipAddress = "127.0.0.1"; // Internal service call
        
        PaymentResponse response = paymentService.createPayment(request, ipAddress);
        return ResponseEntity.ok(response);
    }
}

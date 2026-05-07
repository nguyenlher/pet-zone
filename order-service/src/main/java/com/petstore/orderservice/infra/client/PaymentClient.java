package com.petstore.orderservice.infra.client;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.petstore.orderservice.api.dto.request.CreatePaymentRequest;
import com.petstore.orderservice.api.dto.response.PaymentResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentClient {

    @Qualifier("paymentRestClient")
    private final RestClient paymentRestClient;

    public PaymentResponse createPayment(UUID orderId, String paymentMethod, double amount) {
        try {
            CreatePaymentRequest request = CreatePaymentRequest.builder()
                    .orderId(orderId)
                    .paymentMethod(paymentMethod)
                    .amount(amount)
                    .build();

            return paymentRestClient.post()
                    .uri("/private/payments")
                    .body(request)
                    .retrieve()
                    .body(PaymentResponse.class);
        } catch (Exception e) {
            log.error("Failed to create payment for order: {}", orderId, e);
            throw new RuntimeException("Failed to create payment: " + e.getMessage());
        }
    }
}

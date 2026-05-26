package com.petstore.paymentservice.domain.service.strategy;

import java.util.Map;

import com.petstore.paymentservice.api.dto.request.CreatePaymentRequest;
import com.petstore.paymentservice.api.dto.response.PaymentCallbackResponse;
import com.petstore.paymentservice.api.dto.response.PaymentResponse;
import com.petstore.paymentservice.domain.model.enums.PaymentMethod;

public interface PaymentStrategy {

    PaymentMethod getPaymentMethod();

    PaymentResponse createPayment(CreatePaymentRequest request, String ipAddress);

    PaymentCallbackResponse handleReturn(Map<String, String> params);
}

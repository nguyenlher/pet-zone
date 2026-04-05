package com.petstore.paymentservice.service.strategy;

import java.util.Map;

import com.petstore.paymentservice.dto.request.CreatePaymentRequest;
import com.petstore.paymentservice.dto.response.PaymentCallbackResponse;
import com.petstore.paymentservice.dto.response.PaymentResponse;
import com.petstore.paymentservice.model.enums.PaymentMethod;

public interface PaymentStrategy {

    PaymentMethod getPaymentMethod();

    PaymentResponse createPayment(CreatePaymentRequest request, String ipAddress);

    PaymentCallbackResponse handleReturn(Map<String, String> params);
}

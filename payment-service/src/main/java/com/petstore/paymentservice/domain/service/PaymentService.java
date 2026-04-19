package com.petstore.paymentservice.domain.service;

import java.util.Map;
import com.petstore.paymentservice.api.dto.request.CreatePaymentRequest;
import com.petstore.paymentservice.api.dto.response.PaymentCallbackResponse;
import com.petstore.paymentservice.api.dto.response.PaymentResponse;

public interface PaymentService {
    PaymentResponse createPayment(CreatePaymentRequest request, String ipAddress);
    PaymentCallbackResponse handleCallback(String paymentMethod, Map<String, String> params);
    PaymentCallbackResponse handleIpn(String paymentMethod, Map<String, String> params);
}

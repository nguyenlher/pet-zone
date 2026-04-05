package com.petstore.paymentservice.service;

import java.util.Map;
import com.petstore.paymentservice.dto.request.CreatePaymentRequest;
import com.petstore.paymentservice.dto.response.PaymentCallbackResponse;
import com.petstore.paymentservice.dto.response.PaymentResponse;

public interface PaymentService {
    PaymentResponse createPayment(CreatePaymentRequest request, String ipAddress);
    PaymentCallbackResponse handleCallback(String paymentMethod, Map<String, String> params);
    PaymentCallbackResponse handleIpn(String paymentMethod, Map<String, String> params);
}

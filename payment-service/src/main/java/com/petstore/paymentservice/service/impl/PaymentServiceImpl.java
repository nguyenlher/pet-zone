package com.petstore.paymentservice.service.impl;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.petstore.paymentservice.dto.request.CreatePaymentRequest;
import com.petstore.paymentservice.dto.response.PaymentCallbackResponse;
import com.petstore.paymentservice.dto.response.PaymentResponse;
import com.petstore.paymentservice.model.enums.PaymentMethod;
import com.petstore.paymentservice.service.PaymentService;
import com.petstore.paymentservice.service.strategy.PaymentStrategy;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final List<PaymentStrategy> strategies;
    private final Map<PaymentMethod, PaymentStrategy> strategyMap = new EnumMap<>(PaymentMethod.class);

    @PostConstruct
    private void initStrategies() {
        for (PaymentStrategy s : strategies) {
            strategyMap.put(s.getPaymentMethod(), s);
            log.info("Registered payment strategy: {}", s.getPaymentMethod());
        }
    }

    @Override
    public PaymentResponse createPayment(CreatePaymentRequest request, String ipAddress) {
        PaymentMethod method = PaymentMethod.valueOf(request.getPaymentMethod().toUpperCase());
        return getStrategy(method).createPayment(request, ipAddress);
    }

    @Override
    public PaymentCallbackResponse handleCallback(String paymentMethodStr, Map<String, String> params) {
        PaymentMethod method = PaymentMethod.valueOf(paymentMethodStr.toUpperCase());
        return getStrategy(method).handleReturn(params);
    }

    @Override
    public PaymentCallbackResponse handleIpn(String paymentMethodStr, Map<String, String> params) {
        PaymentMethod method = PaymentMethod.valueOf(paymentMethodStr.toUpperCase());
        return getStrategy(method).handleReturn(params);
    }

    private PaymentStrategy getStrategy(PaymentMethod method) {
        PaymentStrategy strategy = strategyMap.get(method);
        if (strategy == null) {
            throw new IllegalArgumentException("No payment strategy found for method: " + method);
        }
        return strategy;
    }
}

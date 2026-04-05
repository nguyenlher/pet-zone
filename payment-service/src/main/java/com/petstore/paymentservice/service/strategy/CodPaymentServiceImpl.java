package com.petstore.paymentservice.integration;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.petstore.paymentservice.client.OrderClient;
import com.petstore.paymentservice.client.OrderInfo;
import com.petstore.paymentservice.dto.request.CreatePaymentRequest;
import com.petstore.paymentservice.dto.response.PaymentCallbackResponse;
import com.petstore.paymentservice.dto.response.PaymentResponse;
import com.petstore.paymentservice.model.Payment;
import com.petstore.paymentservice.model.enums.PaymentMethod;
import com.petstore.paymentservice.model.enums.PaymentStatus;
import com.petstore.paymentservice.repository.PaymentRepository;
import com.petstore.paymentservice.service.strategy.PaymentStrategy;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class CodPaymentServiceImpl implements PaymentStrategy {

    private final PaymentRepository paymentRepository;
    private final OrderClient orderClient;

    @Override
    public PaymentMethod getPaymentMethod() {
        return PaymentMethod.COD;
    }

    @Override
    public PaymentResponse createPayment(CreatePaymentRequest request, String ipAddress) {
        Optional<Payment> existing = paymentRepository.findByOrderId(request.getOrderId());
        if (existing.isPresent()) {
            return PaymentResponse.builder()
                    .id(existing.get().getId())
                    .orderId(existing.get().getOrderId())
                    .paymentUrl(null)
                    .status(existing.get().getStatus())
                    .build();
        }

        OrderInfo order = orderClient.getOrder(request.getOrderId());

        Payment payment = Payment.builder()
                .orderId(order.id())
                .userId(order.userId())
                .transactionId("COD-" + UUID.randomUUID().toString().substring(0, 8)) 
                .amount(order.totalAmount())
                .paymentMethod(PaymentMethod.COD)
                .status(PaymentStatus.PENDING) 
                .createdAt(LocalDateTime.now())
                .build();

        Payment saved = paymentRepository.save(payment);

        log.info("Created COD payment with id: {} for order: {}", saved.getId(), order.id());

        return PaymentResponse.builder()
                .id(saved.getId())
                .orderId(order.id())
                .paymentUrl(null) // COD does not require redirection to a payment gateway
                .status(PaymentStatus.PENDING)
                .build();
    }

    @Override
    public PaymentCallbackResponse handleReturn(Map<String, String> params) {
        // COD does not have automated hooks like VNPay.
        // Usually, the shipper or admin updates the payment status manually using a different API endpoint.
        log.warn("COD does not support automatic return callbacks. Params received: {}", params);
        
        return PaymentCallbackResponse.builder()
                .code("00")
                .message("COD payment does not use standard callback.")
                .status(PaymentStatus.PENDING.name())
                .build();
    }
}

package com.petstore.paymentservice.infra.publisher.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.petstore.paymentservice.domain.model.Payment;
import com.petstore.paymentservice.domain.publisher.PaymentPublisher;
import com.petstore.paymentservice.infra.publisher.message.payment.PaymentCancelledMessage;
import com.petstore.paymentservice.infra.publisher.message.payment.PaymentFailedMessage;
import com.petstore.paymentservice.infra.publisher.message.payment.PaymentSucceededMessage;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentPublisherImpl implements PaymentPublisher {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${app.kafka.topics.payment.succeeded}")
    private String paymentSucceededTopic;

    @Value("${app.kafka.topics.payment.failed}")
    private String paymentFailedTopic;

    @Value("${app.kafka.topics.payment.cancelled:${app.kafka.topics.payment.canceled:payment.cancelled}}")
    private String paymentCancelledTopic;

    @Override
    public void publishPaymentSucceeded(Payment payment) {
        var message = PaymentSucceededMessage.builder()
                .orderId(payment.getOrderId())
                .paymentId(payment.getId())
                .transactionId(payment.getTransactionId())
                .userId(payment.getUserId())
                .build();
        kafkaTemplate.send(paymentSucceededTopic, payment.getOrderId().toString(), message);
    }

    @Override
    public void publishPaymentFailed(Payment payment, String reason) {
        var message = PaymentFailedMessage.builder()
                .orderId(payment.getOrderId())
                .paymentId(payment.getId())
                .reason(reason)
                .build();
        kafkaTemplate.send(paymentFailedTopic, payment.getOrderId().toString(), message);
    }

    @Override
    public void publishPaymentCancelled(Payment payment) {
        var message = PaymentCancelledMessage.builder()
                .orderId(payment.getOrderId())
                .paymentId(payment.getId())
                .build();
        kafkaTemplate.send(paymentCancelledTopic, payment.getOrderId().toString(), message);
    }
}

package com.petstore.paymentservice.publisher.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.petstore.paymentservice.model.Payment;
import com.petstore.paymentservice.publisher.PaymentPublisher;
import com.petstore.paymentservice.publisher.message.payment.PaymentCanceledMessage;
import com.petstore.paymentservice.publisher.message.payment.PaymentFailedMessage;
import com.petstore.paymentservice.publisher.message.payment.PaymentSucceededMessage;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentPublisherImpl implements PaymentPublisher {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${app.kafka.topics.payment.succeeded}")
    private String paymentSucceededTopic;

    @Value("${app.kafka.topics.payment.failed}")
    private String paymentFailedTopic;

    @Value("${app.kafka.topics.payment.canceled}")
    private String paymentCanceledTopic;

    @Override
    public void publishPaymentSucceeded(Payment payment) {
        var message = PaymentSucceededMessage.builder()
                .orderId(payment.getOrderId())
                .paymentId(payment.getId())
                .transactionId(payment.getTransactionId())
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
    public void publishPaymentCanceled(Payment payment) {
        var message = PaymentCanceledMessage.builder()
                .orderId(payment.getOrderId())
                .paymentId(payment.getId())
                .build();
        kafkaTemplate.send(paymentCanceledTopic, payment.getOrderId().toString(), message);
    }
}

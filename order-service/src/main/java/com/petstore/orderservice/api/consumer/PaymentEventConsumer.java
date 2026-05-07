package com.petstore.orderservice.api.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.petstore.orderservice.api.consumer.message.PaymentFailedMessage;
import com.petstore.orderservice.api.consumer.message.PaymentSucceededMessage;
import com.petstore.orderservice.domain.model.enums.OrderStatus;
import com.petstore.orderservice.domain.service.impl.OrderServiceImpl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentEventConsumer {

    private final OrderServiceImpl orderService;
    private final ObjectMapper objectMapper;

    @KafkaListener(
            topics = "${app.kafka.topics.payment.succeeded}",
            groupId = "${spring.kafka.consumer.group-id}",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void handlePaymentSucceeded(@Payload String payload, Acknowledgment acknowledgment) {
        try {
            PaymentSucceededMessage message = objectMapper.readValue(payload, PaymentSucceededMessage.class);
            log.info("Received payment succeeded event for order: {}", message.getOrderId());
            
            orderService.updateOrderStatusFromPayment(message.getOrderId(), OrderStatus.PENDING);
            log.info("Order {} status updated to PENDING after successful payment", message.getOrderId());
            
            acknowledgment.acknowledge();
        } catch (Exception e) {
            log.error("Failed to process payment succeeded event", e);
            // Don't acknowledge - message will be retried
        }
    }

    @KafkaListener(
            topics = "${app.kafka.topics.payment.failed}",
            groupId = "${spring.kafka.consumer.group-id}",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void handlePaymentFailed(@Payload String payload, Acknowledgment acknowledgment) {
        try {
            PaymentFailedMessage message = objectMapper.readValue(payload, PaymentFailedMessage.class);
            log.info("Received payment failed event for order: {}", message.getOrderId());
            
            orderService.updateOrderStatusFromPayment(message.getOrderId(), OrderStatus.PAYMENT_FAILED);
            log.info("Order {} status updated to PAYMENT_FAILED", message.getOrderId());
            
            acknowledgment.acknowledge();
        } catch (Exception e) {
            log.error("Failed to process payment failed event", e);
            // Don't acknowledge - message will be retried
        }
    }
}

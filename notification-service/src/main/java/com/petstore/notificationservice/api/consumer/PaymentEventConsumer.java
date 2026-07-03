package com.petstore.notificationservice.api.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.petstore.notificationservice.api.consumer.message.PaymentSucceededMessage;
import com.petstore.notificationservice.domain.service.NotificationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentEventConsumer {

    private final NotificationService notificationService;
    private final ObjectMapper objectMapper;

    @KafkaListener(
            topics = "${app.kafka.topics.payment.succeeded:payment.succeeded}",
            groupId = "${spring.kafka.consumer.group-id:notification-service-group}",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void handlePaymentSucceeded(@Payload String payload, Acknowledgment acknowledgment) {
        try {
            log.info("Received payment succeeded event: {}", payload);
            PaymentSucceededMessage message = objectMapper.readValue(payload, PaymentSucceededMessage.class);
            
            if (message.getUserId() != null) {
                log.info("Processing payment success notification for user: {}, order: {}", 
                        message.getUserId(), message.getOrderId());
                notificationService.sendPaymentSuccessNoti(message.getUserId());
            } else {
                log.warn("Payment succeeded event missing userId for order: {}", message.getOrderId());
            }

            acknowledgment.acknowledge();
        } catch (Exception e) {
            log.error("Failed to process payment succeeded event: {}", payload, e);
            throw new RuntimeException("Error processing payment succeeded event", e);
        }
    }
}

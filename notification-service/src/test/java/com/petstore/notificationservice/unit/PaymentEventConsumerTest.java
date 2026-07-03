package com.petstore.notificationservice.unit;

import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.support.Acknowledgment;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.petstore.notificationservice.api.consumer.PaymentEventConsumer;
import com.petstore.notificationservice.api.consumer.message.PaymentSucceededMessage;
import com.petstore.notificationservice.domain.service.NotificationService;

import static org.junit.jupiter.api.Assertions.assertThrows;

@ExtendWith(MockitoExtension.class)
class PaymentEventConsumerTest {

    @Mock
    private NotificationService notificationService;

    @Mock
    private Acknowledgment acknowledgment;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private PaymentEventConsumer consumer;

    @BeforeEach
    void setUp() {
        consumer = new PaymentEventConsumer(notificationService, objectMapper);
    }

    @Test
    void handlePaymentSucceeded_Success_CallsNotificationServiceAndAcknowledges() throws Exception {
        UUID userId = UUID.randomUUID();
        UUID orderId = UUID.randomUUID();
        UUID paymentId = UUID.randomUUID();

        PaymentSucceededMessage message = PaymentSucceededMessage.builder()
                .userId(userId)
                .orderId(orderId)
                .paymentId(paymentId)
                .transactionId("VNPAY-123456")
                .build();

        String payload = objectMapper.writeValueAsString(message);

        consumer.handlePaymentSucceeded(payload, acknowledgment);

        verify(notificationService).sendPaymentSuccessNoti(userId);
        verify(acknowledgment).acknowledge();
    }

    @Test
    void handlePaymentSucceeded_MissingUserId_SkipsNotificationAndAcknowledges() throws Exception {
        UUID orderId = UUID.randomUUID();
        UUID paymentId = UUID.randomUUID();

        PaymentSucceededMessage message = PaymentSucceededMessage.builder()
                .orderId(orderId)
                .paymentId(paymentId)
                .transactionId("VNPAY-123456")
                .build(); // userId is null

        String payload = objectMapper.writeValueAsString(message);

        consumer.handlePaymentSucceeded(payload, acknowledgment);

        verify(notificationService, never()).sendPaymentSuccessNoti(any());
        verify(acknowledgment).acknowledge();
    }

    @Test
    void handlePaymentSucceeded_InvalidJson_ThrowsExceptionAndDoesNotAcknowledge() {
        String invalidPayload = "{invalid-json";

        assertThrows(RuntimeException.class, () -> consumer.handlePaymentSucceeded(invalidPayload, acknowledgment));

        verify(notificationService, never()).sendPaymentSuccessNoti(any());
        verify(acknowledgment, never()).acknowledge();
    }
}

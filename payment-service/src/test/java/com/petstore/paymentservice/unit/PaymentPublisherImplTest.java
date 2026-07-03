package com.petstore.paymentservice.unit;

import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;

import com.petstore.paymentservice.domain.model.Payment;
import com.petstore.paymentservice.domain.model.enums.PaymentMethod;
import com.petstore.paymentservice.domain.model.enums.PaymentStatus;
import com.petstore.paymentservice.infra.publisher.impl.PaymentPublisherImpl;
import com.petstore.paymentservice.infra.publisher.message.payment.PaymentSucceededMessage;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@ExtendWith(MockitoExtension.class)
class PaymentPublisherImplTest {

    @Mock
    private KafkaTemplate<String, Object> kafkaTemplate;

    private PaymentPublisherImpl paymentPublisher;

    @BeforeEach
    void setUp() throws Exception {
        paymentPublisher = new PaymentPublisherImpl(kafkaTemplate);
        setField(paymentPublisher, "paymentSucceededTopic", "payment.succeeded");
        setField(paymentPublisher, "paymentFailedTopic", "payment.failed");
        setField(paymentPublisher, "paymentCancelledTopic", "payment.cancelled");
    }

    private void setField(Object target, String fieldName, Object value) throws Exception {
        Field field = target.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(target, value);
    }

    @Test
    void publishPaymentSucceeded_SendsKafkaMessageWithUserId() {
        UUID orderId = UUID.randomUUID();
        UUID paymentId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();

        Payment payment = Payment.builder()
                .id(paymentId)
                .orderId(orderId)
                .userId(userId)
                .amount(150000.0)
                .status(PaymentStatus.SUCCESS)
                .paymentMethod(PaymentMethod.VNPAY)
                .transactionId("VNPAY-TRANS-999")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        paymentPublisher.publishPaymentSucceeded(payment);

        ArgumentCaptor<PaymentSucceededMessage> messageCaptor = ArgumentCaptor.forClass(PaymentSucceededMessage.class);
        verify(kafkaTemplate).send(eq("payment.succeeded"), eq(orderId.toString()), messageCaptor.capture());

        PaymentSucceededMessage sentMessage = messageCaptor.getValue();
        assertNotNull(sentMessage);
        assertEquals(orderId, sentMessage.getOrderId());
        assertEquals(paymentId, sentMessage.getPaymentId());
        assertEquals("VNPAY-TRANS-999", sentMessage.getTransactionId());
        assertEquals(userId, sentMessage.getUserId());
    }
}

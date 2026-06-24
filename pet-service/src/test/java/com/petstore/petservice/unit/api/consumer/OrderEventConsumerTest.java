package com.petstore.petservice.unit.api.consumer;

import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.support.Acknowledgment;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.petstore.petservice.api.consumer.OrderEventConsumer;
import com.petstore.petservice.domain.service.StockReservationService;

@ExtendWith(MockitoExtension.class)
class OrderEventConsumerTest {

    @Mock
    private StockReservationService stockReservationService;

    @Mock
    private Acknowledgment acknowledgment;

    private ObjectMapper objectMapper;
    private OrderEventConsumer orderEventConsumer;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        orderEventConsumer = new OrderEventConsumer(stockReservationService, objectMapper);
    }

    @Test
    @DisplayName("Should successfully deserialize order-cancelled message from order-service and restore stock for PRODUCT items")
    void handleOrderCancelled_success_restoresProductStock() {
        UUID orderId = UUID.randomUUID();
        UUID productId = UUID.randomUUID();
        UUID petId = UUID.randomUUID();

        // Exact JSON format published by order-service OrderPublisherImpl (including extra fields)
        String payload = """
        {
            "orderId": "%s",
            "userId": "%s",
            "reason": "Payment timeout - order cancelled after 30 minutes",
            "status": "CANCELLED",
            "cancelledAt": "2026-09-20T12:00:00",
            "items": [
                {
                    "itemType": "PRODUCT",
                    "itemId": "%s",
                    "itemName": "Dog Food Premium",
                    "quantity": 3,
                    "unitPrice": 25.0,
                    "subtotalAmount": 75.0
                },
                {
                    "itemType": "PET",
                    "itemId": "%s",
                    "itemName": "Golden Retriever Puppy",
                    "quantity": 1,
                    "unitPrice": 500.0,
                    "subtotalAmount": 500.0
                }
            ]
        }
        """.formatted(orderId, UUID.randomUUID(), productId, petId);

        orderEventConsumer.handleOrderCancelled(payload, acknowledgment);

        // Verify stock restore was called for the PRODUCT with quantity 3
        verify(stockReservationService).restoreStock(productId, 3);
        // Verify stock restore was NOT called for PET
        verify(stockReservationService, never()).restoreStock(petId, 1);
        // Verify message was acknowledged
        verify(acknowledgment).acknowledge();
    }

    @Test
    @DisplayName("Should not acknowledge when deserialization fails due to corrupt payload")
    void handleOrderCancelled_invalidPayload_doesNotAcknowledge() {
        String corruptPayload = "INVALID_JSON";

        orderEventConsumer.handleOrderCancelled(corruptPayload, acknowledgment);

        verify(stockReservationService, never()).restoreStock(org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.anyInt());
        verify(acknowledgment, never()).acknowledge();
    }
}

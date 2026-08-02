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
import com.petstore.petservice.domain.service.PetReservationService;
import com.petstore.petservice.domain.service.StockReservationService;

@ExtendWith(MockitoExtension.class)
class OrderEventConsumerTest {

    @Mock
    private StockReservationService stockReservationService;

    @Mock
    private PetReservationService petReservationService;

    @Mock
    private Acknowledgment acknowledgment;

    private ObjectMapper objectMapper;
    private OrderEventConsumer orderEventConsumer;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        orderEventConsumer = new OrderEventConsumer(stockReservationService, petReservationService, objectMapper);
    }

    @Test
    @DisplayName("Should successfully deserialize order-cancelled message and restore stock for PRODUCT and availability for PET")
    void handleOrderCancelled_success_restoresProductStockAndPetAvailability() {
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
        // Verify pet restore was called for the PET
        verify(petReservationService).restorePet(petId);
        // Verify message was acknowledged
        verify(acknowledgment).acknowledge();
    }

    @Test
    @DisplayName("Should successfully deserialize order-confirmed message and confirm pet sold")
    void handleOrderConfirmed_success_confirmsPetSold() {
        UUID orderId = UUID.randomUUID();
        UUID petId = UUID.randomUUID();

        String payload = """
        {
            "orderId": "%s",
            "userId": "%s",
            "status": "CONFIRM",
            "confirmedAt": "2026-09-20T12:00:00",
            "items": [
                {
                    "itemType": "PET",
                    "itemId": "%s",
                    "itemName": "Golden Retriever Puppy",
                    "quantity": 1
                }
            ]
        }
        """.formatted(orderId, UUID.randomUUID(), petId);

        orderEventConsumer.handleOrderConfirmed(payload, acknowledgment);

        verify(petReservationService).confirmPetSold(petId);
        verify(acknowledgment).acknowledge();
    }

    @Test
    @DisplayName("Should not acknowledge when deserialization fails due to corrupt payload")
    void handleOrderCancelled_invalidPayload_doesNotAcknowledge() {
        String corruptPayload = "INVALID_JSON";

        orderEventConsumer.handleOrderCancelled(corruptPayload, acknowledgment);

        verify(stockReservationService, never()).restoreStock(org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.anyInt());
        verify(petReservationService, never()).restorePet(org.mockito.ArgumentMatchers.any());
        verify(acknowledgment, never()).acknowledge();
    }
}

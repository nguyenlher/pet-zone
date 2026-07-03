package com.petstore.orderservice.api.consumer.message;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentSucceededMessage {
    private UUID orderId;
    private UUID paymentId;
    private String transactionId;
    private UUID userId;
}

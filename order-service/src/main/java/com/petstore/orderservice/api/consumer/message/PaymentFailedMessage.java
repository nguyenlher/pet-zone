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
public class PaymentFailedMessage {
    private UUID orderId;
    private UUID paymentId;
    private String reason;
}

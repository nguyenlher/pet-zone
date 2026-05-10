package com.petstore.paymentservice.api.dto.response;

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
public class PaymentCallbackResponse {
    private String code;
    private String message;
    private String transactionId;
    private String status;
    private Boolean success;
    private UUID orderId;
}

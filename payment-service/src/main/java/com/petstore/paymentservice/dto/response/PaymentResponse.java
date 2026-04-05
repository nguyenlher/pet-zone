package com.petstore.paymentservice.dto.response;

import java.util.UUID;

import com.petstore.paymentservice.model.enums.PaymentStatus;

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
public class PaymentResponse {
    private UUID id;
    private UUID orderId;
    private String paymentUrl;
    private PaymentStatus status;
}

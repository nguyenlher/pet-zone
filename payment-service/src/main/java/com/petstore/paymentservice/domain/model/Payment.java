package com.petstore.paymentservice.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;

import com.petstore.paymentservice.domain.model.enums.PaymentMethod;
import com.petstore.paymentservice.domain.model.enums.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class Payment {
    UUID id;
    UUID orderId;
    UUID userId;
    String transactionId;
    double amount;
    PaymentMethod paymentMethod;
    PaymentStatus status;
    LocalDateTime expiredAt;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}

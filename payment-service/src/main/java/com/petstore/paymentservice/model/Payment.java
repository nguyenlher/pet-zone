package com.petstore.paymentservice.model;

import com.petstore.paymentservice.model.enums.PaymentMethod;
import com.petstore.paymentservice.model.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class Payment {
    UUID id;
    UUID orderId;
    UUID userId;
    String transactionId;
    double amount;
    PaymentMethod method;
    PaymentStatus status;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}

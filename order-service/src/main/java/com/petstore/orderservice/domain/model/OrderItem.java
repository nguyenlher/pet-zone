package com.petstore.orderservice.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AccessLevel;
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
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderItem {
    UUID id;
    UUID orderId;
    UUID petId;
    String petName;
    double unitPrice;
    int quantity;
    double subtotalAmount;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}

package com.petstore.orderservice.model;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

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
    int quantity;
    double subtotalAmount;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}

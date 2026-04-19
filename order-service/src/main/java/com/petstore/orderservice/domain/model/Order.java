package com.petstore.orderservice.domain.model;

import com.petstore.orderservice.domain.model.enums.OrderStatus;
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
public class Order {
    UUID id;
    UUID userId;
    UUID petId;
    double discountAmount;
    double shippingFee;
    String address;
    OrderStatus status;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}

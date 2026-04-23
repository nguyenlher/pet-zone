package com.petstore.orderservice.domain.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.petstore.orderservice.domain.model.enums.OrderStatus;

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
public class Order {
    UUID id;
    UUID userId;
    List<OrderItem> items;
    double subtotalAmount;
    double discountAmount;
    double shippingFee;
    double totalAmount;
    String address;
    OrderStatus status;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}

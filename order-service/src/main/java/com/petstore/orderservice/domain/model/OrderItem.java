package com.petstore.orderservice.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;

import com.petstore.orderservice.domain.model.enums.ItemType;

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
    ItemType itemType;
    UUID itemId;
    String itemName;
    double unitPrice;
    int quantity;
    double subtotalAmount;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}

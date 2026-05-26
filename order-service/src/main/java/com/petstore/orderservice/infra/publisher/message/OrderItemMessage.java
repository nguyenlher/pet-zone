package com.petstore.orderservice.infra.publisher.message;

import java.util.UUID;

import com.petstore.orderservice.domain.model.enums.ItemType;

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
public class OrderItemMessage {
    private ItemType itemType;
    private UUID itemId;
    private String itemName;
    private int quantity;
    private double unitPrice;
    private double subtotalAmount;
}

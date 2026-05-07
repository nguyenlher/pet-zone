package com.petstore.orderservice.infra.publisher.message;

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
public class OrderItemMessage {
    private UUID petId;
    private String petName;
    private int quantity;
    private double unitPrice;
    private double subtotalAmount;
}

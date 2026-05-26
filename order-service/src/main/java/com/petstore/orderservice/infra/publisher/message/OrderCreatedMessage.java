package com.petstore.orderservice.infra.publisher.message;

import java.time.LocalDateTime;
import java.util.List;
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
public class OrderCreatedMessage {
    private UUID orderId;
    private UUID userId;
    private List<OrderItemMessage> items;
    private double totalAmount;
    private String status;
    private LocalDateTime createdAt;
}

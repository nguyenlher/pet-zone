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
public class OrderCancelledMessage {
    private UUID orderId;
    private UUID userId;
    private String reason;
    private String status;
    private LocalDateTime cancelledAt;
    private List<OrderItemMessage> items;
}

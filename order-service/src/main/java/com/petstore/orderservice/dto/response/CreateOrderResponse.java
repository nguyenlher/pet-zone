package com.petstore.orderservice.dto.response;

import com.petstore.orderservice.model.enums.OrderStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateOrderResponse {
    UUID orderId;
    UUID userId;
    double subtotalAmount;
    double discountAmount;
    double shippingFee;
    double totalAmount;
    OrderStatus orderStatus;
    List<OrderItemResponse> items;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}

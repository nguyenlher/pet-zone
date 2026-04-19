package com.petstore.orderservice.api.dto.response;

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
public class CancelOrderResponse {
    UUID orderId;
    OrderStatus orderStatus;
    LocalDateTime updatedAt;
    String message;
}

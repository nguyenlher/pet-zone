package com.petstore.orderservice.api.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateOrderRequest {
    UUID userId;
    List<OrderItemRequest> items;
    ShippingDetailRequest shipping;
    String discountCode;
}

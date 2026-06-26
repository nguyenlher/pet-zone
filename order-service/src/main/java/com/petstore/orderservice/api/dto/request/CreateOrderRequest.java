package com.petstore.orderservice.api.dto.request;

import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
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
public class CreateOrderRequest {
    UUID userId;

    @NotEmpty(message = "Items list cannot be empty")
    @Valid
    List<OrderItemRequest> items;

    @NotNull(message = "Shipping details are required")
    @Valid
    ShippingDetailRequest shipping;

    String discountCode;
}

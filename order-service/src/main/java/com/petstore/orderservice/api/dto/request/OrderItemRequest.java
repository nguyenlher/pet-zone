package com.petstore.orderservice.api.dto.request;

import java.util.UUID;

import com.petstore.orderservice.domain.model.enums.ItemType;

import jakarta.validation.constraints.Min;
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
public class OrderItemRequest {
    @NotNull(message = "Item type is required")
    ItemType itemType;  // PET or PRODUCT

    @NotNull(message = "Item ID is required")
    UUID itemId;        // ID of pet or product

    @Min(value = 1, message = "Item quantity must be greater than 0")
    int quantity;
}

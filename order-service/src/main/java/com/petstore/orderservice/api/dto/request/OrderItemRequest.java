package com.petstore.orderservice.api.dto.request;

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
public class OrderItemRequest {
    ItemType itemType;  // PET or PRODUCT
    UUID itemId;        // ID of pet or product
    int quantity;
}

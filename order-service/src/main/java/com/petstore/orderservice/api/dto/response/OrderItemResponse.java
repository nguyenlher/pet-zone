package com.petstore.orderservice.api.dto.response;

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
public class OrderItemResponse {
    ItemType itemType;  // PET or PRODUCT
    UUID id;            // ID of pet or product
    String name;        // Name of pet or product
    int quantity;
    double price;
    double subtotalPrice;
}

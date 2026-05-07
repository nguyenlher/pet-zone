package com.petstore.orderservice.domain.model;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderShippingDetail {
    UUID id;
    String name;
    String phone;
    String address;
    String city;
    String paymentMethod;
}

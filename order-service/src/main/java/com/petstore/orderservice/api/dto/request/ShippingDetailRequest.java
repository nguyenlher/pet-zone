package com.petstore.orderservice.api.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShippingDetailRequest {
    String name;
    String phone;
    String address;
    String city;
    String paymentMethod;
}

package com.petstore.orderservice.api.dto.request;

import jakarta.validation.constraints.NotBlank;
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
public class ShippingDetailRequest {
    @NotBlank(message = "Recipient name is required")
    String name;

    @NotBlank(message = "Phone number is required")
    String phone;

    @NotBlank(message = "Address is required")
    String address;

    @NotBlank(message = "City is required")
    String city;

    @NotBlank(message = "Payment method is required")
    String paymentMethod;
}

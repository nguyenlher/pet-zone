package com.petstore.userservice.model;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class UserShippingInfo {
    UUID id;
    UUID userId;
    String phoneNumber;
    String addressLine;
    String district;
    String city;
    boolean isDefault;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
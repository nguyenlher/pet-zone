package com.petstore.userservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
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
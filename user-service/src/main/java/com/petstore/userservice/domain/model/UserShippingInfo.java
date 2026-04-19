package com.petstore.userservice.domain.model;

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
    String address;
    String district;
    String city;
    String note;
    boolean isDefault;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
package com.petstore.userservice.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserShippingInfoRequest {
    UUID id;
    UUID userId;
    String phoneNumber;
    String address;
    String district;
    String city;
    String note;
    Boolean isDefault;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}

package com.petstore.orderservice.domain.model;

import com.petstore.orderservice.domain.model.enums.DiscountType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Discount {
    UUID id;
    String code;
    String description;
    DiscountType type;
    double maxDiscountAmount;
    double minOrderAmount;
    int usageLimit;
    LocalDateTime expired;
    boolean isActive;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}

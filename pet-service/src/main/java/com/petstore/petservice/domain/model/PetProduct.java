package com.petstore.petservice.domain.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.petstore.petservice.domain.model.enums.ProductCategory;
import com.petstore.petservice.domain.model.enums.ProductStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class PetProduct {
    UUID id;
    String name;
    String brand;
    ProductCategory category;
    UUID petTypeId;
    BigDecimal price;
    Integer stockQuantity;
    Integer soldCount;
    String description;
    ProductStatus status;
    Double avgRating;
    Integer totalReviews;
    Integer viewCount;
    List<PetProductImage> images;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}

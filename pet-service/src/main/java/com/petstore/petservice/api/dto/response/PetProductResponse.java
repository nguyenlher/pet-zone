package com.petstore.petservice.api.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.petstore.petservice.domain.model.enums.ProductCategory;
import com.petstore.petservice.domain.model.enums.ProductStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PetProductResponse {
    private UUID id;
    private String name;
    private String brand;
    private ProductCategory category;
    private UUID petTypeId;
    private BigDecimal price;
    private Integer stockQuantity;
    private Integer soldCount;
    private String description;
    private ProductStatus status;
    private Double avgRating;
    private Integer totalReviews;
    private Integer viewCount;
    private List<PetProductImageResponse> images;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

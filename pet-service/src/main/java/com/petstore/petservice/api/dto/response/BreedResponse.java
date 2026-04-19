package com.petstore.petservice.api.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BreedResponse {
    private UUID id;
    private String name;
    private UUID petTypeId;
    private String petTypeName;
    private String description;
    private Double avgRating;
    private Integer totalReviews;
    private String imageUrl;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
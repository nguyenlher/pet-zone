package com.petstore.petservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

import com.petstore.petservice.model.enums.PetType;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BreedResponse {
    private UUID id;
    private String name;
    private PetType petType;
    private String description;
    private Double avgRating;
    private Integer totalReviews;
    private String imageUrl;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
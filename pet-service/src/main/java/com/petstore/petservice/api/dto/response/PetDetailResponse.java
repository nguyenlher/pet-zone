package com.petstore.petservice.api.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.petstore.petservice.domain.model.enums.FurType;
import com.petstore.petservice.domain.model.enums.Gender;
import com.petstore.petservice.domain.model.enums.HealthStatus;
import com.petstore.petservice.domain.model.enums.PetStatus;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PetDetailResponse {
    private UUID id;
    private String name;
    
    // Breed info
    private UUID breedId;
    private String breedName;
    private UUID petTypeId;
    private String petTypeName;
    private BreedResponse breed;
    
    // Basic info
    private Gender gender;
    private LocalDate birthDate;
    private Integer ageInMonths;
    private Double weight;
    private Double height;
    private List<String> colors;
    private FurType furType;
    
    // Health
    private HealthStatus healthStatus;
    private Boolean vaccinated;
    
    // Business
    private BigDecimal price;
    private String description;
    private PetStatus status;
    
    // Media
    private List<PetProductImageResponse> images;
    
    // Metrics
    private Integer viewCount;
    
    // 3D Model
    private Pet3DModelResponse model3d;
    
    // Audit
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Helper
    @JsonProperty("thumbnailUrl")
    public String getThumbnailUrl() {
        if (images != null && !images.isEmpty()) {
            return images.stream()
                    .filter(img -> Boolean.TRUE.equals(img.getIsThumbnail()))
                    .findFirst()
                    .map(PetProductImageResponse::getImageUrl)
                    .orElse(images.get(0).getImageUrl());
        }
        return null;
    }
    
    @JsonProperty("imageUrls")
    public List<String> getAllImageUrls() {
        if (images != null) {
            return images.stream()
                    .map(PetProductImageResponse::getImageUrl)
                    .toList();
        }
        return List.of();
    }
}
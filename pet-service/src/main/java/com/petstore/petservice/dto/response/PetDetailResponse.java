package com.petstore.petservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.petstore.petservice.model.enums.*;

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
    private List<PetImageResponse> images;
    
    // Metrics
    private Integer viewCount;
    
    // 3D Model
    private Pet3DModelResponse model3d;
    
    // Audit
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Helper
    public String getThumbnailUrl() {
        if (images != null && !images.isEmpty()) {
            return images.stream()
                    .filter(PetImageResponse::getIsThumbnail)
                    .findFirst()
                    .map(PetImageResponse::getImageUrl)
                    .orElse(images.get(0).getImageUrl());
        }
        return null;
    }
    
    public List<String> getImageUrls() {
        if (images != null) {
            return images.stream()
                    .map(PetImageResponse::getImageUrl)
                    .toList();
        }
        return List.of();
    }
}
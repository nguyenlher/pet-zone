package com.petstore.petservice.dto.response;

import com.petstore.petservice.enums.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PetDetailResponse {
    private UUID id;
    private String name;
    private PetType petType;
    
    // Breed info
    private UUID breedId;
    private String breedName;
    
    // Basic info
    private Gender gender;
    private LocalDate birthDate;
    private Integer ageInMonths;
    private Double weight;
    private Double height;
    private String[] colors;
    private ColorPattern colorPattern;
    private FurType furType;
    
    // Health
    private HealthStatus healthStatus;
    private Boolean vaccinated;
    
    // Business
    private Double price;
    private String description;
    private PetStatus status;
    
    // Media
    private String thumbnailUrl;
    private String[] imageUrls;
    
    // AI Generated
    private String aiDescription;
    
    // Metrics
    private Integer viewCount;
    
    // 3D Model
    private Pet3DModelResponse model3d;
    
    // Audit
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
package com.petstore.petservice.dto.response;

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
    private String petType;
    
    // Breed info
    private UUID breedPrimaryId;
    private String breedPrimaryName;
    private UUID breedSecondaryId;
    private String breedSecondaryName;
    private Boolean isMixedBreed;
    
    // Basic info
    private String gender;
    private LocalDate birthDate;
    private Integer age;
    private Double weight;
    private Double height;
    private Double length;
    private String[] colors;
    private String colorPattern;
    private String furType;
    
    // Face features
    private String faceShape;
    private String eyeColor;
    private String eyeShape;
    private String earType;
    private String muzzleLength;
    
    // Body features
    private String bodyShape;
    private String legLength;
    private String tailType;
    private String[] distinctiveFeatures;
    
    // Health
    private String healthStatus;
    private Boolean spayedNeutered;
    private Boolean vaccinated;
    private Boolean dewormed;
    private LocalDate lastCheckupDate;
    private String[] allergies;
    private String[] chronicConditions;
    
    // Behavior
    private Integer energyLevel;
    private Integer sociability;
    private Integer childFriendly;
    private Integer petFriendly;
    private Integer trainability;
    private Integer barkingTendency;
    private Integer separationAnxiety;
    private String[] commands;
    private String[] favoriteActivities;
    
    // AI 3D Model
    private String model3dUrlGlb;
    private String model3dUrlObj;
    private String modelThumbnailUrl;
    private String modelSourceImageUrl;
    private Boolean modelAiGenerated;
    private Double modelConfidenceScore;
    private LocalDateTime modelGeneratedAt;
    
    // AI Generated
    private String aiDescription;
    private String[] aiTags;
    private Double aiPriceSuggestion;
    
    // Price & Listing
    private Double price;
    private Double originalPrice;
    private Boolean negotiable;
    private LocalDate availableFrom;
    private LocalDate availableTo;
    
    // Location
    private String city;
    private String district;
    private String addressDetail;
    private Double latitude;
    private Double longitude;
    
    // Status
    private String status;
    private Boolean isFeatured;
    private LocalDate featuredUntil;
    private String[] promotionBadges;
    
    // Metrics
    private Integer viewCount;
    private Integer favoriteCount;
    private Integer inquiryCount;
    
    // Media
    private String[] imageUrls;
    private String[] videoUrls;
    
    // Audit
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
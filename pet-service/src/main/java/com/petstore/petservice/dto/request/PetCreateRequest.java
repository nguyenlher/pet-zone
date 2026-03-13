package com.petstore.petservice.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PetCreateRequest {
    @NotBlank(message = "Pet name is required")
    @Size(min = 2, max = 100, message = "Pet name must be between 2 and 100 characters")
    private String name;
    
    @NotBlank(message = "Pet type is required")
    @Pattern(regexp = "dog|cat", message = "Pet type must be 'dog' or 'cat'")
    private String petType;
    
    @NotNull(message = "Breed is required")
    private UUID breedPrimaryId;
    
    private UUID breedSecondaryId;
    
    @NotBlank(message = "Gender is required")
    @Pattern(regexp = "male|female", message = "Gender must be 'male' or 'female'")
    private String gender;
    
    private LocalDate birthDate;
    private String birthDateAccuracy;
    
    @DecimalMin(value = "0.1", message = "Weight must be at least 0.1 kg")
    @DecimalMax(value = "100", message = "Weight must not exceed 100 kg")
    private Double weight;
    
    @DecimalMin(value = "1", message = "Height must be at least 1 cm")
    @DecimalMax(value = "150", message = "Height must not exceed 150 cm")
    private Double height;
    
    @DecimalMin(value = "10", message = "Length must be at least 10 cm")
    @DecimalMax(value = "250", message = "Length must not exceed 250 cm")
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
    
    // Price
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
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
    
    // AI 3D Model
    private String modelSourceImageUrl;
}
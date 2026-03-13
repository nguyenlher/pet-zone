package com.petstore.petservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class Pet {
    UUID id;
    String name;
    String petType;
    UUID breedPrimaryId;
    UUID breedSecondaryId;
    String gender;
    LocalDate birthDate;
    String birthDateAccuracy;
    Double weight;
    Double height;
    Double length;
    String[] colors;
    String colorPattern;
    String furType;
    String faceShape;
    String eyeColor;
    String eyeShape;
    String earType;
    String muzzleLength;
    String bodyShape;
    String legLength;
    String tailType;
    String[] distinctiveFeatures;
    String healthStatus;
    Boolean spayedNeutered;
    Boolean vaccinated;
    Boolean dewormed;
    LocalDate lastCheckupDate;
    String[] allergies;
    String[] chronicConditions;
    Integer energyLevel;
    Integer sociability;
    Integer childFriendly;
    Integer petFriendly;
    Integer trainability;
    Integer barkingTendency;
    Integer separationAnxiety;
    String[] commands;
    String[] favoriteActivities;
    String model3dUrlGlb;
    String model3dUrlObj;
    String modelTextureUrl;
    String modelThumbnailUrl;
    String modelSourceImageUrl;
    Boolean modelAiGenerated;
    Double modelConfidenceScore;
    LocalDateTime modelGeneratedAt;
    String aiDescription;
    String[] aiTags;
    Double aiPriceSuggestion;
    Double price;
    Double originalPrice;
    Boolean negotiable;
    LocalDate availableFrom;
    LocalDate availableTo;
    String city;
    String district;
    String addressDetail;
    Double latitude;
    Double longitude;
    String status;
    Boolean isFeatured;
    LocalDate featuredUntil;
    String[] promotionBadges;
    Integer viewCount;
    Integer favoriteCount;
    Integer inquiryCount;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
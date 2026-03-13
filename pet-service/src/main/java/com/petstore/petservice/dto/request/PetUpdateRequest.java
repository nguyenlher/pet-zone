package com.petstore.petservice.dto.request;

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
public class PetUpdateRequest {
    private String name;
    private UUID breedPrimaryId;
    private UUID breedSecondaryId;
    private Double weight;
    private Double height;
    private Double length;
    private String[] colors;
    private String colorPattern;
    private String furType;
    private String faceShape;
    private String eyeColor;
    private String eyeShape;
    private String earType;
    private String muzzleLength;
    private String bodyShape;
    private String legLength;
    private String tailType;
    private String[] distinctiveFeatures;
    private String healthStatus;
    private Boolean spayedNeutered;
    private Boolean vaccinated;
    private Boolean dewormed;
    private LocalDate lastCheckupDate;
    private String[] allergies;
    private String[] chronicConditions;
    private Integer energyLevel;
    private Integer sociability;
    private Integer childFriendly;
    private Integer petFriendly;
    private Integer trainability;
    private Integer barkingTendency;
    private Integer separationAnxiety;
    private String[] commands;
    private String[] favoriteActivities;
    private Double price;
    private Double originalPrice;
    private Boolean negotiable;
    private LocalDate availableFrom;
    private LocalDate availableTo;
    private String city;
    private String district;
    private String addressDetail;
    private Double latitude;
    private Double longitude;
    private String status;
    private Boolean isFeatured;
    private LocalDate featuredUntil;
    private String[] promotionBadges;
}
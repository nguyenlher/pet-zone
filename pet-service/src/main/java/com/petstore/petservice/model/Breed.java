package com.petstore.petservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class Breed {
    UUID id;
    String name;
    String petType; // dog, cat
    String groupName;
    String description;
    String originCountry;
    String sizeCategory; // small, medium, large
    Double avgWeightMin;
    Double avgWeightMax;
    Double avgHeightMin;
    Double avgHeightMax;
    String commonColors;
    String coatType;
    Integer sheddingLevel; // 1-5
    Integer typicalEnergy; // 1-5
    Integer typicalTrainability; // 1-5
    Integer goodWithChildren; // 1-5
    Integer goodWithPets; // 1-5
    Integer barkingLevel; // 1-5
    String groomingNeeds; // low, medium, high
    String exerciseNeeds; // low, medium, high
    String model3dTemplateUrl;
    String[] aiPromptKeywords;
    Boolean isActive;
    Integer displayOrder;
    String imageUrl;
    String iconUrl;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
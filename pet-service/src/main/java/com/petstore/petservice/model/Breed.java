package com.petstore.petservice.model;

import com.petstore.petservice.enums.*;
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
    PetType petType;
    String description;
    String originCountry;
    Double avgWeightMin;
    Double avgWeightMax;
    Double avgHeightMin;
    Double avgHeightMax;
    String commonColors;
    String lifeExpectancy;
    Double avgRating;
    Integer totalReviews;
    String imageUrl;
    String model3dTemplateUrl;
    Boolean isActive;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
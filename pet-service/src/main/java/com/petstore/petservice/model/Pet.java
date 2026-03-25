package com.petstore.petservice.model;

import com.petstore.petservice.enums.*;
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
    PetType petType;
    UUID breedId;
    Gender gender;
    LocalDate birthDate;
    Double weight;
    Double height;
    String[] colors;
    ColorPattern colorPattern;
    FurType furType;
    HealthStatus healthStatus;
    Boolean vaccinated;
    Double price;
    String description;
    PetStatus status;
    String thumbnailUrl;
    String[] imageUrls;
    String aiDescription;
    Integer viewCount;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
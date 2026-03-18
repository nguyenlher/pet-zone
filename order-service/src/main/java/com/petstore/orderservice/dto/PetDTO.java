package com.petstore.orderservice.dto;

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
public class PetDTO {
    UUID id;
    String name;
    String petType;
    UUID breedId;
    String gender;
    LocalDate birthDate;
    Double weight;
    Double height;
    String[] colors;
    String colorPattern;
    String furType;
    String healthStatus;
    Boolean vaccinated;
    Double price;
    String description;
    String status;
    String thumbnailUrl;
    String[] imageUrls;
    String aiDescription;
    Integer viewCount;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
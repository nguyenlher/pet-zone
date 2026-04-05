package com.petstore.petservice.model;

import java.time.LocalDateTime;
import java.util.UUID;

import com.petstore.petservice.model.enums.PetType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

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

    Double avgRating;

    Integer totalReviews;

    String ImageUrl;

    Boolean isActive;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;
}
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
public class BreedReview {
    UUID id;
    UUID breedId;
    Breed breed; //optional
    UUID userId;
    Integer rating; // 1-5 sao
    String comment;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
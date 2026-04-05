package com.petstore.petservice.model;

import java.time.LocalDateTime;
import java.util.UUID;

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
public class BreedReview {
    UUID id;
    UUID breedId;
    UUID userId;
    Boolean verifiedPurchase;
    Integer rating;
    String comment;
    Integer likes;
    LocalDateTime createdAt;
}
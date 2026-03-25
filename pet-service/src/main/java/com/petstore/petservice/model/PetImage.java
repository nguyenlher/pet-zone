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
public class PetImage {
    UUID id;
    UUID petId;
    String imageUrl;
    Boolean isThumbnail;
    Integer sortOrder;
    LocalDateTime createdAt;
}
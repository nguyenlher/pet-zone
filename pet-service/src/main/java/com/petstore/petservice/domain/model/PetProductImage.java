package com.petstore.petservice.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;

import com.petstore.petservice.domain.model.enums.EntityType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class PetProductImage {
    UUID id;
    EntityType entityType;
    UUID entityId;
    String imageUrl;
    Boolean isThumbnail;
    Integer displayOrder;
    LocalDateTime createdAt;
}

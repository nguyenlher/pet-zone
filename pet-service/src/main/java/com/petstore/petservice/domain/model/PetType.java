package com.petstore.petservice.domain.model;

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
public class PetType {
    UUID id;
    String name;
    String description;
    String iconUrl;
    Boolean isActive;
    Integer displayOrder;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}

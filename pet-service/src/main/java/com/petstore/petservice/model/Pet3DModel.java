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
public class Pet3DModel {
    UUID id;
    UUID petId;
    String modelUrl;
    String sourceImageUrl;
    String thumbnailUrl;
    Boolean aiGenerated;
    Double confidenceScore;
    LocalDateTime generatedAt;
    LocalDateTime createdAt;
}
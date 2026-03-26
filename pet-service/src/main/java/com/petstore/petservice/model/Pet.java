package com.petstore.petservice.model;

import com.petstore.petservice.enums.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class Pet {
    UUID id;
    String name;
    UUID breedId;
    Breed breed; //optional
    Gender gender;
    LocalDate birthDate;
    Double weight;
    Double height;
    List<String> colors; 
    FurType furType;
    HealthStatus healthStatus;
    Boolean vaccinated;
    BigDecimal price; 
    String description;
    PetStatus status;
    Integer viewCount;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    
    List<PetImage> images;
    
    // Helper để lấy thumbnail (ảnh đầu tiên hoặc ảnh có isThumbnail=true)
    public String getThumbnailUrl() {
        if (images != null && !images.isEmpty()) {
            return images.stream()
                    .filter(PetImage::getIsThumbnail)
                    .findFirst()
                    .map(PetImage::getImageUrl)
                    .orElse(images.get(0).getImageUrl());
        }
        return null;
    }
    
    // Helper để lấy tất cả URLs ảnh
    public List<String> getImageUrls() {
        if (images != null) {
            return images.stream()
                    .map(PetImage::getImageUrl)
                    .toList();
        }
        return List.of();
    }
}
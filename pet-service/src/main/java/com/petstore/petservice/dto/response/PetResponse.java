package com.petstore.petservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PetResponse {
    private UUID id;
    private String name;
    private String petType;
    private String breedName;
    private String gender;
    private Integer age; // Tính từ birthDate
    private Double weight;
    private String[] colors;
    private Double price;
    private String city;
    private String status;
    private Boolean isFeatured;
    private Integer viewCount;
    private Integer favoriteCount;
    private String primaryImageUrl;
    private String modelThumbnailUrl;
    private Boolean has3DModel;
    private LocalDateTime createdAt;
}
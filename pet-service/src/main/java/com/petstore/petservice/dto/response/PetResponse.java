package com.petstore.petservice.dto.response;

import com.petstore.petservice.enums.*;
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
    private PetType petType;
    private String breedName;
    private Gender gender;
    private Integer ageInMonths;
    private Double weight;
    private String[] colors;
    private Double price;
    private PetStatus status;
    private Integer viewCount;
    private String thumbnailUrl;
    private Boolean has3DModel;
    private LocalDateTime createdAt;
}
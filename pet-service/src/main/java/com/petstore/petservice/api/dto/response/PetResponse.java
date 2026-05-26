package com.petstore.petservice.api.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.petstore.petservice.domain.model.enums.Gender;
import com.petstore.petservice.domain.model.enums.PetStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PetResponse {
    private UUID id;
    private String name;
    private String breedName;
    private UUID petTypeId;
    private String petTypeName;
    private Gender gender;
    private Integer ageInMonths;
    private Double weight;
    private List<String> colors;
    private BigDecimal price;
    private PetStatus status;
    private Integer viewCount;
    private String thumbnailUrl;
    private Boolean has3DModel;
    private LocalDateTime createdAt;
}
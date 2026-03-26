package com.petstore.petservice.dto.response;

import com.petstore.petservice.enums.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PetResponse {
    private UUID id;
    private String name;
    private String breedName;
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
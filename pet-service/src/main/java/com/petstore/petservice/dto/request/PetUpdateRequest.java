package com.petstore.petservice.dto.request;

import com.petstore.petservice.enums.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PetUpdateRequest {
    private String name;
    private UUID breedId;
    private Double weight;
    private Double height;
    private String[] colors;
    private ColorPattern colorPattern;
    private FurType furType;
    private HealthStatus healthStatus;
    private Boolean vaccinated;
    private Double price;
    private String description;
    private PetStatus status;
    private String thumbnailUrl;
    private String[] imageUrls;
}
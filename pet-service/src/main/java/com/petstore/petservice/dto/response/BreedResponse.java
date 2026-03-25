package com.petstore.petservice.dto.response;

import com.petstore.petservice.enums.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BreedResponse {
    private UUID id;
    private String name;
    private PetType petType;
    private String description;
    private String originCountry;
    private Double avgWeightMin;
    private Double avgWeightMax;
    private Double avgHeightMin;
    private Double avgHeightMax;
    private String commonColors;
    private String lifeExpectancy;
    private Double avgRating;
    private Integer totalReviews;
    private String imageUrl;
    private Boolean isActive;
}
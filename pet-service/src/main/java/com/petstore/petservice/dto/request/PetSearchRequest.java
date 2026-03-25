package com.petstore.petservice.dto.request;

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
public class PetSearchRequest {
    private String keyword;
    private PetType petType;
    private UUID breedId;
    private Gender gender;
    private Double minWeight;
    private Double maxWeight;
    private Double minPrice;
    private Double maxPrice;
    private PetStatus status;
    private Integer minAge; // Months
    private Integer maxAge; // Months
    private String[] colors;
    private String sortBy; // price, createdAt, viewCount
    private String sortDirection; // asc, desc
}
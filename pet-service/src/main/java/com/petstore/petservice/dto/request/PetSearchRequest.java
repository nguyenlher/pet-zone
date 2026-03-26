package com.petstore.petservice.dto.request;

import com.petstore.petservice.enums.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PetSearchRequest {
    private String keyword;
    private UUID breedId;
    private Gender gender;
    private Double minWeight;
    private Double maxWeight;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private PetStatus status;
    private Integer minAge; // Months
    private Integer maxAge; // Months
    private List<String> colors;
    private String sortBy; // price, createdAt, viewCount
    private String sortDirection; // asc, desc
}
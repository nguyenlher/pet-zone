package com.petstore.petservice.dto.request;

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
    private String keyword; // Tìm theo tên
    private String petType; // dog, cat
    private UUID breedId;
    private String gender;
    private Double minWeight;
    private Double maxWeight;
    private Double minPrice;
    private Double maxPrice;
    private String city;
    private String status;
    private Boolean isFeatured;
    private Integer minAge; // Tháng tuổi tối thiểu
    private Integer maxAge; // Tháng tuổi tối đa
    private String[] colors;
    private String sortBy; // price, createdAt, viewCount
    private String sortDirection; // asc, desc
}
package com.petstore.statisticsservice.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PetStatisticsDto {
    private Long totalPets;
    private Long availablePets;
    private Long soldPets;
    private Long reservedPets;
    private List<TopPetDto> topViewedPets;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopPetDto {
        private String id;
        private String name;
        private String imageUrl;
        private Double price;
        private Integer viewCount;
    }
}

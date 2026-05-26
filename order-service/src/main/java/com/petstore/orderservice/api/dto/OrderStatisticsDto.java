package com.petstore.orderservice.api.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatisticsDto {
    private Long totalOrders;
    private Long completedOrders;
    private Long pendingOrders;
    private Long cancelledOrders;
    private Map<String, Long> statusDistribution;
    private List<TopSellingPetDto> topSellingPets;
    private LocalDate startDate;
    private LocalDate endDate;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopSellingPetDto {
        private String petId;
        private String petName;
        private Long quantitySold;
        private Double totalRevenue;
    }
}

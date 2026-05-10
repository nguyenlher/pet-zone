package com.petstore.statisticsservice.api.dto.response;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevenueStatsResponse {
    private List<RevenueDataPoint> data;
    private Double totalRevenue;
    private Integer totalTransactions;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RevenueDataPoint {
        private LocalDate date;
        private Double revenue;
        private Integer transactionCount;
    }
}

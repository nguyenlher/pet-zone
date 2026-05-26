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
public class SalesChartResponse {
    private List<SalesDataPoint> data;
    private SalesMetrics metrics;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SalesDataPoint {
        private LocalDate date;
        private Double income;
        private Double expenses;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SalesMetrics {
        private Double totalIncome;
        private Double totalExpenses;
        private Double netProfit;
        private Double profitMargin;
    }
}

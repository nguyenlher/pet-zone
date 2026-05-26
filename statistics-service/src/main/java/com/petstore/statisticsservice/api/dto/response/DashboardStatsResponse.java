package com.petstore.statisticsservice.api.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private List<StatCard> stats;
    private LocalDateTime lastUpdated;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatCard {
        private String id;
        private String label;
        private Long value;
        private String formatted;
        private Double change;
        private Boolean positive;
        private String icon;
        private String color;
        private String iconColor;
    }
}

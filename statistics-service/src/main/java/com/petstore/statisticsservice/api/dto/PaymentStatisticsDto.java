package com.petstore.statisticsservice.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentStatisticsDto {
    private Long totalPayments;
    private Long successfulPayments;
    private Long pendingPayments;
    private Long failedPayments;
    private Double totalRevenue;
    private Map<String, Long> paymentMethodDistribution;
    private Map<String, Long> statusDistribution;
    private LocalDate startDate;
    private LocalDate endDate;
}

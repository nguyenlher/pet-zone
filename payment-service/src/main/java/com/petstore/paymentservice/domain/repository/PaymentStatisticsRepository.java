package com.petstore.paymentservice.domain.repository;

import java.time.LocalDate;
import java.util.Map;

public interface PaymentStatisticsRepository {
    Long countTotalPayments();
    Long countPaymentsByStatus(String status);
    Long countPaymentsByStatusAndDateRange(String status, LocalDate startDate, LocalDate endDate);
    Double getTotalRevenue(LocalDate startDate, LocalDate endDate);
    Map<String, Long> getPaymentMethodDistribution(LocalDate startDate, LocalDate endDate);
    Map<String, Long> getStatusDistribution(LocalDate startDate, LocalDate endDate);
}

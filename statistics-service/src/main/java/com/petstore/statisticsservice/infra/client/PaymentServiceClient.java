package com.petstore.statisticsservice.infra.client;

import com.petstore.statisticsservice.api.dto.PaymentStatisticsDto;

import java.time.LocalDate;

public interface PaymentServiceClient {
    PaymentStatisticsDto getPaymentStatistics(LocalDate startDate, LocalDate endDate);
}

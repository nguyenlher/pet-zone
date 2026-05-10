package com.petstore.paymentservice.domain.service;

import java.time.LocalDate;

import com.petstore.paymentservice.api.dto.PaymentStatisticsDto;

public interface PaymentStatisticsService {
    PaymentStatisticsDto getPaymentStatistics(LocalDate startDate, LocalDate endDate);
}

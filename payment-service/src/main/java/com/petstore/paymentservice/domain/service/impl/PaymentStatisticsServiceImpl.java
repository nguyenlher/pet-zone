package com.petstore.paymentservice.domain.service.impl;

import java.time.LocalDate;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.petstore.paymentservice.api.dto.PaymentStatisticsDto;
import com.petstore.paymentservice.domain.repository.PaymentStatisticsRepository;
import com.petstore.paymentservice.domain.service.PaymentStatisticsService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentStatisticsServiceImpl implements PaymentStatisticsService {

    private final PaymentStatisticsRepository paymentStatisticsRepository;

    @Override
    public PaymentStatisticsDto getPaymentStatistics(LocalDate startDate, LocalDate endDate) {
        log.info("Getting payment statistics from {} to {}", startDate, endDate);
        
        Long totalPayments = paymentStatisticsRepository.countTotalPayments();
        Long successfulPayments = paymentStatisticsRepository.countPaymentsByStatus("SUCCESS");
        Long pendingPayments = paymentStatisticsRepository.countPaymentsByStatus("PENDING");
        Long failedPayments = paymentStatisticsRepository.countPaymentsByStatus("FAILED");
        
        Double totalRevenue = paymentStatisticsRepository.getTotalRevenue(startDate, endDate);
        Map<String, Long> paymentMethodDistribution = paymentStatisticsRepository.getPaymentMethodDistribution(startDate, endDate);
        Map<String, Long> statusDistribution = paymentStatisticsRepository.getStatusDistribution(startDate, endDate);
        
        return PaymentStatisticsDto.builder()
            .totalPayments(totalPayments)
            .successfulPayments(successfulPayments)
            .pendingPayments(pendingPayments)
            .failedPayments(failedPayments)
            .totalRevenue(totalRevenue)
            .paymentMethodDistribution(paymentMethodDistribution)
            .statusDistribution(statusDistribution)
            .startDate(startDate)
            .endDate(endDate)
            .build();
    }
}

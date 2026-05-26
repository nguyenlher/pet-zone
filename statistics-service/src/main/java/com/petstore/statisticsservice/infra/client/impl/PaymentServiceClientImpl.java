package com.petstore.statisticsservice.infra.client.impl;

import com.petstore.statisticsservice.api.dto.PaymentStatisticsDto;
import com.petstore.statisticsservice.infra.client.PaymentServiceClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceClientImpl implements PaymentServiceClient {

    @Qualifier("paymentRestClient")
    private final RestClient paymentRestClient;

    @Override
    public PaymentStatisticsDto getPaymentStatistics(LocalDate startDate, LocalDate endDate) {
        log.info("Calling payment-service private API for statistics");
        
        try {
            return paymentRestClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/private/payments/statistics")
                            .queryParamIfPresent("startDate", java.util.Optional.ofNullable(startDate))
                            .queryParamIfPresent("endDate", java.util.Optional.ofNullable(endDate))
                            .build())
                    .retrieve()
                    .body(PaymentStatisticsDto.class);
        } catch (Exception e) {
            log.error("Error calling payment-service: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to get payment statistics", e);
        }
    }
}

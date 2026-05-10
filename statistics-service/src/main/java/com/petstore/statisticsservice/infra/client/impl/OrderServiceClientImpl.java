package com.petstore.statisticsservice.infra.client.impl;

import com.petstore.statisticsservice.api.dto.OrderStatisticsDto;
import com.petstore.statisticsservice.infra.client.OrderServiceClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderServiceClientImpl implements OrderServiceClient {

    @Qualifier("orderRestClient")
    private final RestClient orderRestClient;

    @Override
    public OrderStatisticsDto getOrderStatistics(LocalDate startDate, LocalDate endDate, Integer topPetsLimit) {
        log.info("Calling order-service private API for statistics");
        
        try {
            return orderRestClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/private/orders/statistics")
                            .queryParamIfPresent("startDate", java.util.Optional.ofNullable(startDate))
                            .queryParamIfPresent("endDate", java.util.Optional.ofNullable(endDate))
                            .queryParamIfPresent("topPetsLimit", java.util.Optional.ofNullable(topPetsLimit))
                            .build())
                    .retrieve()
                    .body(OrderStatisticsDto.class);
        } catch (Exception e) {
            log.error("Error calling order-service: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to get order statistics", e);
        }
    }
}

package com.petstore.statisticsservice.infra.client;

import com.petstore.statisticsservice.api.dto.OrderStatisticsDto;

import java.time.LocalDate;

public interface OrderServiceClient {
    OrderStatisticsDto getOrderStatistics(LocalDate startDate, LocalDate endDate, Integer topPetsLimit);
}

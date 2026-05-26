package com.petstore.orderservice.domain.service;

import java.time.LocalDate;

import com.petstore.orderservice.api.dto.OrderStatisticsDto;

public interface OrderStatisticsService {
    OrderStatisticsDto getOrderStatistics(LocalDate startDate, LocalDate endDate, Integer topPetsLimit);
}

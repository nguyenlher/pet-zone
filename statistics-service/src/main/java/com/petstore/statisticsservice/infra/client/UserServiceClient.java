package com.petstore.statisticsservice.infra.client;

import com.petstore.statisticsservice.api.dto.UserStatisticsDto;

import java.time.LocalDate;

public interface UserServiceClient {
    UserStatisticsDto getUserStatistics(LocalDate startDate, LocalDate endDate);
}

package com.petstore.userservice.domain.service;

import java.time.LocalDate;

import com.petstore.userservice.api.dto.UserStatisticsDto;

public interface UserStatisticsService {
    UserStatisticsDto getUserStatistics(LocalDate startDate, LocalDate endDate);
}

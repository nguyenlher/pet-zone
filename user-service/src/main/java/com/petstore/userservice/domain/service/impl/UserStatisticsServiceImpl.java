package com.petstore.userservice.domain.service.impl;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.petstore.userservice.api.dto.UserStatisticsDto;
import com.petstore.userservice.domain.repository.UserStatisticsRepository;
import com.petstore.userservice.domain.service.UserStatisticsService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserStatisticsServiceImpl implements UserStatisticsService {

    private final UserStatisticsRepository userStatisticsRepository;

    @Override
    public UserStatisticsDto getUserStatistics(LocalDate startDate, LocalDate endDate) {
        log.info("Getting user statistics from {} to {}", startDate, endDate);
        
        Long totalUsers = userStatisticsRepository.countTotalUsers();
        Long activeUsers = userStatisticsRepository.countActiveUsers();
        Long inactiveUsers = userStatisticsRepository.countInactiveUsers();
        Long newUsersInPeriod = userStatisticsRepository.countNewUsers(startDate, endDate);
        
        return UserStatisticsDto.builder()
            .totalUsers(totalUsers)
            .activeUsers(activeUsers)
            .inactiveUsers(inactiveUsers)
            .newUsersInPeriod(newUsersInPeriod)
            .startDate(startDate)
            .endDate(endDate)
            .build();
    }
}

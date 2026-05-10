package com.petstore.statisticsservice.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatisticsDto {
    private Long totalUsers;
    private Long activeUsers;
    private Long inactiveUsers;
    private Long newUsersInPeriod;
    private LocalDate startDate;
    private LocalDate endDate;
}

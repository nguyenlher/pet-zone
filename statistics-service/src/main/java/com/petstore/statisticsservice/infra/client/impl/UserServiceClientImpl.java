package com.petstore.statisticsservice.infra.client.impl;

import com.petstore.statisticsservice.api.dto.UserStatisticsDto;
import com.petstore.statisticsservice.infra.client.UserServiceClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserServiceClientImpl implements UserServiceClient {

    @Qualifier("userRestClient")
    private final RestClient userRestClient;

    @Override
    public UserStatisticsDto getUserStatistics(LocalDate startDate, LocalDate endDate) {
        log.info("Calling user-service private API for statistics");
        
        try {
            return userRestClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/private/users/statistics")
                            .queryParamIfPresent("startDate", java.util.Optional.ofNullable(startDate))
                            .queryParamIfPresent("endDate", java.util.Optional.ofNullable(endDate))
                            .build())
                    .retrieve()
                    .body(UserStatisticsDto.class);
        } catch (Exception e) {
            log.error("Error calling user-service: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to get user statistics", e);
        }
    }
}

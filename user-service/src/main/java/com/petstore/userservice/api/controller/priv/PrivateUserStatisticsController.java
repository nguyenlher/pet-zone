package com.petstore.userservice.api.controller.priv;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.petstore.userservice.api.dto.UserStatisticsDto;
import com.petstore.userservice.domain.service.UserStatisticsService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Private User Statistics Controller for inter-service communication
 * Used by statistics-service to get user statistics data
 */
@RestController
@RequestMapping("/private/users/statistics")
@RequiredArgsConstructor
@Slf4j
public class PrivateUserStatisticsController {

    private final UserStatisticsService userStatisticsService;

    @GetMapping
    public ResponseEntity<UserStatisticsDto> getUserStatistics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        log.info("Private API: Getting user statistics from {} to {}", startDate, endDate);
        UserStatisticsDto statistics = userStatisticsService.getUserStatistics(startDate, endDate);
        return ResponseEntity.ok(statistics);
    }
}

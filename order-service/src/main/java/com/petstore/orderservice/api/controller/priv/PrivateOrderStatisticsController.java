package com.petstore.orderservice.api.controller.priv;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.petstore.orderservice.api.dto.OrderStatisticsDto;
import com.petstore.orderservice.domain.service.OrderStatisticsService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Private Order Statistics Controller for inter-service communication
 * Used by statistics-service to get order statistics data
 */
@RestController
@RequestMapping("/private/orders/statistics")
@RequiredArgsConstructor
@Slf4j
public class PrivateOrderStatisticsController {

    private final OrderStatisticsService orderStatisticsService;

    @GetMapping
    public ResponseEntity<OrderStatisticsDto> getOrderStatistics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false, defaultValue = "10") Integer topPetsLimit
    ) {
        log.info("Private API: Getting order statistics from {} to {}", startDate, endDate);
        OrderStatisticsDto statistics = orderStatisticsService.getOrderStatistics(startDate, endDate, topPetsLimit);
        return ResponseEntity.ok(statistics);
    }
}

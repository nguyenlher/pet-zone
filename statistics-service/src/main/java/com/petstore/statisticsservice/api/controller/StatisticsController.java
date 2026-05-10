package com.petstore.statisticsservice.api.controller;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.petstore.statisticsservice.api.dto.response.DashboardStatsResponse;
import com.petstore.statisticsservice.api.dto.response.OrderStatsResponse;
import com.petstore.statisticsservice.api.dto.response.PaymentMethodStatsResponse;
import com.petstore.statisticsservice.api.dto.response.RevenueStatsResponse;
import com.petstore.statisticsservice.api.dto.response.SalesChartResponse;
import com.petstore.statisticsservice.api.dto.response.TopPetResponse;
import com.petstore.statisticsservice.api.dto.response.TopProductResponse;
import com.petstore.statisticsservice.domain.service.StatisticsService;
import com.petstore.statisticsservice.utils.StatisticsApiPath;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Statistics Controller
 * All endpoints require ADMIN role
 */
@RestController
@RequestMapping(StatisticsApiPath.BASE)
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('ADMIN')")
public class StatisticsController {

    private final StatisticsService statisticsService;

    @GetMapping(StatisticsApiPath.DASHBOARD)
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        log.info("Admin API: GET request to fetch dashboard statistics");
        DashboardStatsResponse response = statisticsService.getDashboardStats();
        return ResponseEntity.ok(response);
    }

    @GetMapping(StatisticsApiPath.REVENUE)
    public ResponseEntity<RevenueStatsResponse> getRevenueStats(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "day") String groupBy) {
        log.info("Admin API: GET request to fetch revenue statistics: {} to {}, groupBy: {}", startDate, endDate, groupBy);
        RevenueStatsResponse response = statisticsService.getRevenueStats(startDate, endDate, groupBy);
        return ResponseEntity.ok(response);
    }

    @GetMapping(StatisticsApiPath.ORDERS)
    public ResponseEntity<OrderStatsResponse> getOrderStats(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        log.info("Admin API: GET request to fetch order statistics: {} to {}", startDate, endDate);
        OrderStatsResponse response = statisticsService.getOrderStats(startDate, endDate);
        return ResponseEntity.ok(response);
    }

    @GetMapping(StatisticsApiPath.TOP_PETS)
    public ResponseEntity<Page<TopPetResponse>> getTopSellingPets(
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("Admin API: GET request to fetch top {} selling pets", limit);
        Pageable pageable = PageRequest.of(page, size);
        Page<TopPetResponse> response = statisticsService.getTopSellingPets(limit, startDate, endDate, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/top-products")
    public ResponseEntity<Page<TopProductResponse>> getTopSellingProducts(
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("Admin API: GET request to fetch top {} selling products", limit);
        Pageable pageable = PageRequest.of(page, size);
        Page<TopProductResponse> response = statisticsService.getTopSellingProducts(limit, startDate, endDate, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping(StatisticsApiPath.SALES_CHART)
    public ResponseEntity<SalesChartResponse> getSalesChartData(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        log.info("Admin API: GET request to fetch sales chart data: {} to {}", startDate, endDate);
        SalesChartResponse response = statisticsService.getSalesChartData(startDate, endDate);
        return ResponseEntity.ok(response);
    }

    @GetMapping(StatisticsApiPath.PAYMENT_METHODS)
    public ResponseEntity<PaymentMethodStatsResponse> getPaymentMethodStats(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        log.info("Admin API: GET request to fetch payment method statistics: {} to {}", startDate, endDate);
        PaymentMethodStatsResponse response = statisticsService.getPaymentMethodStats(startDate, endDate);
        return ResponseEntity.ok(response);
    }

    @GetMapping(StatisticsApiPath.CUSTOMERS)
    public ResponseEntity<Object> getCustomerStats() {
        log.info("Admin API: GET request to fetch customer statistics");
        // This will be implemented later if needed
        return ResponseEntity.ok().build();
    }
}

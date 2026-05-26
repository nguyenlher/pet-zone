package com.petstore.statisticsservice.domain.service;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.petstore.statisticsservice.api.dto.response.DashboardStatsResponse;
import com.petstore.statisticsservice.api.dto.response.OrderStatsResponse;
import com.petstore.statisticsservice.api.dto.response.PaymentMethodStatsResponse;
import com.petstore.statisticsservice.api.dto.response.RevenueStatsResponse;
import com.petstore.statisticsservice.api.dto.response.SalesChartResponse;
import com.petstore.statisticsservice.api.dto.response.TopPetResponse;
import com.petstore.statisticsservice.api.dto.response.TopProductResponse;

public interface StatisticsService {
    
    DashboardStatsResponse getDashboardStats();
    
    RevenueStatsResponse getRevenueStats(LocalDate startDate, LocalDate endDate, String groupBy);
    
    OrderStatsResponse getOrderStats(LocalDate startDate, LocalDate endDate);
    
    Page<TopPetResponse> getTopSellingPets(int limit, LocalDate startDate, LocalDate endDate, Pageable pageable);
    
    Page<TopProductResponse> getTopSellingProducts(int limit, LocalDate startDate, LocalDate endDate, Pageable pageable);
    
    SalesChartResponse getSalesChartData(LocalDate startDate, LocalDate endDate);
    
    PaymentMethodStatsResponse getPaymentMethodStats(LocalDate startDate, LocalDate endDate);
}

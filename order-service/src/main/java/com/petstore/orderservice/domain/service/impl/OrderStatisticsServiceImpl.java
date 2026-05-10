package com.petstore.orderservice.domain.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.petstore.orderservice.api.dto.OrderStatisticsDto;
import com.petstore.orderservice.domain.repository.OrderStatisticsRepository;
import com.petstore.orderservice.domain.service.OrderStatisticsService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderStatisticsServiceImpl implements OrderStatisticsService {

    private final OrderStatisticsRepository orderStatisticsRepository;

    @Override
    public OrderStatisticsDto getOrderStatistics(LocalDate startDate, LocalDate endDate, Integer topPetsLimit) {
        log.info("Getting order statistics from {} to {}", startDate, endDate);
        
        int limit = topPetsLimit != null ? topPetsLimit : 10;
        
        Long totalOrders = orderStatisticsRepository.countTotalOrders();
        Long completedOrders = orderStatisticsRepository.countOrdersByStatus("COMPLETED");
        Long pendingOrders = orderStatisticsRepository.countOrdersByStatus("PENDING");
        Long cancelledOrders = orderStatisticsRepository.countOrdersByStatus("CANCELLED");
        
        Map<String, Long> statusDistribution = orderStatisticsRepository.getOrderStatusDistribution(startDate, endDate);
        
        List<OrderStatisticsDto.TopSellingPetDto> topSellingPets = orderStatisticsRepository
            .getTopSellingPets(limit, startDate, endDate)
            .stream()
            .map(data -> OrderStatisticsDto.TopSellingPetDto.builder()
                .petId(data.petId())
                .petName(data.petName())
                .quantitySold(data.quantitySold())
                .totalRevenue(data.totalRevenue())
                .build())
            .toList();
        
        return OrderStatisticsDto.builder()
            .totalOrders(totalOrders)
            .completedOrders(completedOrders)
            .pendingOrders(pendingOrders)
            .cancelledOrders(cancelledOrders)
            .statusDistribution(statusDistribution)
            .topSellingPets(topSellingPets)
            .startDate(startDate)
            .endDate(endDate)
            .build();
    }
}

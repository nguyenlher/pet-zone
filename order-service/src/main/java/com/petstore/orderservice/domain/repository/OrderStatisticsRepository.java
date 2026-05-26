package com.petstore.orderservice.domain.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface OrderStatisticsRepository {
    Long countTotalOrders();
    Long countOrdersByStatus(String status);
    Long countOrdersByStatusAndDateRange(String status, LocalDate startDate, LocalDate endDate);
    Map<String, Long> getOrderStatusDistribution(LocalDate startDate, LocalDate endDate);
    List<TopSellingPetData> getTopSellingPets(int limit, LocalDate startDate, LocalDate endDate);
    
    record TopSellingPetData(String petId, String petName, Long quantitySold, Double totalRevenue) {}
}

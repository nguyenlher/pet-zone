package com.petstore.statisticsservice.domain.service.impl;

import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.CompletableFuture;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.petstore.statisticsservice.api.dto.OrderStatisticsDto;
import com.petstore.statisticsservice.api.dto.PaymentStatisticsDto;
import com.petstore.statisticsservice.api.dto.PetStatisticsDto;
import com.petstore.statisticsservice.api.dto.UserStatisticsDto;
import com.petstore.statisticsservice.api.dto.response.DashboardStatsResponse;
import com.petstore.statisticsservice.api.dto.response.OrderStatsResponse;
import com.petstore.statisticsservice.api.dto.response.PaymentMethodStatsResponse;
import com.petstore.statisticsservice.api.dto.response.RevenueStatsResponse;
import com.petstore.statisticsservice.api.dto.response.SalesChartResponse;
import com.petstore.statisticsservice.api.dto.response.TopPetResponse;
import com.petstore.statisticsservice.domain.service.StatisticsService;
import com.petstore.statisticsservice.infra.client.OrderServiceClient;
import com.petstore.statisticsservice.infra.client.PaymentServiceClient;
import com.petstore.statisticsservice.infra.client.PetServiceClient;
import com.petstore.statisticsservice.infra.client.UserServiceClient;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class StatisticsServiceImpl implements StatisticsService {

    private final OrderServiceClient orderServiceClient;
    private final PaymentServiceClient paymentServiceClient;
    private final PetServiceClient petServiceClient;
    private final UserServiceClient userServiceClient;

    @Override
    @Cacheable(value = "dashboard:summary", unless = "#result == null")
    public DashboardStatsResponse getDashboardStats() {
        log.info("Calculating dashboard statistics (cache miss)");

        // Query all stats in parallel using CompletableFuture
        CompletableFuture<PaymentStatisticsDto> paymentStatsFuture = CompletableFuture.supplyAsync(() ->
                paymentServiceClient.getPaymentStatistics(null, null)
        );

        CompletableFuture<OrderStatisticsDto> orderStatsFuture = CompletableFuture.supplyAsync(() ->
                orderServiceClient.getOrderStatistics(null, null, null)
        );

        CompletableFuture<UserStatisticsDto> userStatsFuture = CompletableFuture.supplyAsync(() ->
                userServiceClient.getUserStatistics(null, null)
        );

        // Previous month stats for comparison
        LocalDate lastMonthStart = LocalDate.now().minusMonths(1).withDayOfMonth(1);
        LocalDate lastMonthEnd = lastMonthStart.plusMonths(1).minusDays(1);

        CompletableFuture<PaymentStatisticsDto> lastMonthPaymentFuture = CompletableFuture.supplyAsync(() ->
                paymentServiceClient.getPaymentStatistics(lastMonthStart, lastMonthEnd)
        );

        CompletableFuture<OrderStatisticsDto> lastMonthOrderFuture = CompletableFuture.supplyAsync(() ->
                orderServiceClient.getOrderStatistics(lastMonthStart, lastMonthEnd, null)
        );

        CompletableFuture<UserStatisticsDto> lastMonthUserFuture = CompletableFuture.supplyAsync(() ->
                userServiceClient.getUserStatistics(lastMonthStart, lastMonthEnd)
        );

        // Wait for all to complete
        CompletableFuture.allOf(
                paymentStatsFuture, orderStatsFuture, userStatsFuture,
                lastMonthPaymentFuture, lastMonthOrderFuture, lastMonthUserFuture
        ).join();

        // Get results
        PaymentStatisticsDto paymentStats = paymentStatsFuture.join();
        OrderStatisticsDto orderStats = orderStatsFuture.join();
        UserStatisticsDto userStats = userStatsFuture.join();

        PaymentStatisticsDto lastMonthPayment = lastMonthPaymentFuture.join();
        OrderStatisticsDto lastMonthOrder = lastMonthOrderFuture.join();
        UserStatisticsDto lastMonthUser = lastMonthUserFuture.join();

        // Calculate changes
        Double revenueChange = calculatePercentageChange(paymentStats.getTotalRevenue(), lastMonthPayment.getTotalRevenue());
        Double ordersChange = calculatePercentageChange(orderStats.getCompletedOrders().doubleValue(), lastMonthOrder.getCompletedOrders().doubleValue());
        Double customersChange = calculatePercentageChange(userStats.getTotalUsers().doubleValue(), lastMonthUser.getNewUsersInPeriod().doubleValue());

        // Build stat cards
        List<DashboardStatsResponse.StatCard> stats = new ArrayList<>();

        stats.add(DashboardStatsResponse.StatCard.builder()
                .id("total-revenue")
                .label("Total Revenue")
                .value(paymentStats.getTotalRevenue().longValue())
                .formatted(formatCurrency(paymentStats.getTotalRevenue()))
                .change(revenueChange)
                .positive(revenueChange >= 0)
                .icon("DollarSign")
                .color("bg-emerald-50")
                .iconColor("text-emerald-600")
                .build());

        stats.add(DashboardStatsResponse.StatCard.builder()
                .id("total-orders")
                .label("Total Orders")
                .value(orderStats.getCompletedOrders())
                .formatted(formatNumber(orderStats.getCompletedOrders()))
                .change(ordersChange)
                .positive(ordersChange >= 0)
                .icon("ShoppingBag")
                .color("bg-blue-50")
                .iconColor("text-blue-600")
                .build());

        stats.add(DashboardStatsResponse.StatCard.builder()
                .id("total-customers")
                .label("Total Customers")
                .value(userStats.getTotalUsers())
                .formatted(formatNumber(userStats.getTotalUsers()))
                .change(customersChange)
                .positive(customersChange >= 0)
                .icon("Users")
                .color("bg-purple-50")
                .iconColor("text-purple-600")
                .build());

        stats.add(DashboardStatsResponse.StatCard.builder()
                .id("pending-orders")
                .label("Pending Orders")
                .value(orderStats.getPendingOrders())
                .formatted(formatNumber(orderStats.getPendingOrders()))
                .change(0.0)
                .positive(true)
                .icon("Truck")
                .color("bg-orange-50")
                .iconColor("text-orange-600")
                .build());

        return DashboardStatsResponse.builder()
                .stats(stats)
                .lastUpdated(LocalDateTime.now())
                .build();
    }

    @Override
    @Cacheable(value = "revenue:stats", unless = "#result == null")
    public RevenueStatsResponse getRevenueStats(LocalDate startDate, LocalDate endDate, String groupBy) {
        log.info("Calculating revenue statistics: {} to {}, groupBy: {}", startDate, endDate, groupBy);

        PaymentStatisticsDto paymentStats = paymentServiceClient.getPaymentStatistics(startDate, endDate);

        // For now, return simplified data
        // In the future, you can enhance payment-service to return grouped data
        List<RevenueStatsResponse.RevenueDataPoint> dataPoints = new ArrayList<>();
        
        // Create a single data point with total revenue
        if (paymentStats.getTotalRevenue() != null) {
            dataPoints.add(RevenueStatsResponse.RevenueDataPoint.builder()
                    .date(endDate != null ? endDate : LocalDate.now())
                    .revenue(paymentStats.getTotalRevenue())
                    .transactionCount(paymentStats.getSuccessfulPayments().intValue())
                    .build());
        }

        return RevenueStatsResponse.builder()
                .data(dataPoints)
                .totalRevenue(paymentStats.getTotalRevenue())
                .totalTransactions(paymentStats.getSuccessfulPayments().intValue())
                .build();
    }

    @Override
    @Cacheable(value = "order:stats", unless = "#result == null")
    public OrderStatsResponse getOrderStats(LocalDate startDate, LocalDate endDate) {
        log.info("Calculating order statistics: {} to {}", startDate, endDate);

        OrderStatisticsDto orderStats = orderServiceClient.getOrderStatistics(startDate, endDate, null);

        List<OrderStatsResponse.OrderStatusDistribution> distribution = new ArrayList<>();
        
        if (orderStats.getStatusDistribution() != null) {
            orderStats.getStatusDistribution().forEach((status, count) -> {
                Double percentage = (count.doubleValue() / orderStats.getTotalOrders()) * 100;
                distribution.add(OrderStatsResponse.OrderStatusDistribution.builder()
                        .status(status)
                        .count(count)
                        .percentage(Math.round(percentage * 100.0) / 100.0)
                        .build());
            });
        }

        return OrderStatsResponse.builder()
                .totalOrders(orderStats.getTotalOrders())
                .completedOrders(orderStats.getCompletedOrders())
                .pendingOrders(orderStats.getPendingOrders())
                .cancelledOrders(orderStats.getCancelledOrders())
                .statusDistribution(distribution)
                .build();
    }

    @Override
    @Cacheable(value = "top:pets", unless = "#result == null")
    public Page<TopPetResponse> getTopSellingPets(int limit, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        log.info("Fetching top {} selling pets", limit);

        OrderStatisticsDto orderStats = orderServiceClient.getOrderStatistics(startDate, endDate, limit);
        List<TopPetResponse> topPets = new ArrayList<>();

        int rank = 1;
        if (orderStats.getTopSellingPets() != null) {
            for (OrderStatisticsDto.TopSellingPetDto pet : orderStats.getTopSellingPets()) {
                // Get pet details from pet-service
                PetStatisticsDto petStats = petServiceClient.getPetStatistics(1);
                String imageUrl = "";
                Double price = 0.0;
                
                if (petStats.getTopViewedPets() != null && !petStats.getTopViewedPets().isEmpty()) {
                    // Find matching pet by ID
                    petStats.getTopViewedPets().stream()
                            .filter(p -> p.getId().equals(pet.getPetId()))
                            .findFirst()
                            .ifPresent(p -> {
                                // Use local variables to capture values
                            });
                }
                
                topPets.add(TopPetResponse.builder()
                        .id(java.util.UUID.fromString(pet.getPetId()))
                        .name(pet.getPetName())
                        .imageUrl(imageUrl)
                        .price(price)
                        .quantitySold(pet.getQuantitySold())
                        .totalRevenue(pet.getTotalRevenue())
                        .rank(rank++)
                        .build());
            }
        }

        return new PageImpl<>(topPets, pageable, topPets.size());
    }

    @Override
    @Cacheable(value = "sales:chart", unless = "#result == null")
    public SalesChartResponse getSalesChartData(LocalDate startDate, LocalDate endDate) {
        log.info("Fetching sales chart data: {} to {}", startDate, endDate);

        PaymentStatisticsDto paymentStats = paymentServiceClient.getPaymentStatistics(startDate, endDate);
        
        List<SalesChartResponse.SalesDataPoint> dataPoints = new ArrayList<>();
        double totalIncome = paymentStats.getTotalRevenue() != null ? paymentStats.getTotalRevenue() : 0.0;
        // For now, expenses are estimated as 70% of income (you can adjust this logic)
        double totalExpenses = totalIncome * 0.7;

        // Create a single data point
        dataPoints.add(SalesChartResponse.SalesDataPoint.builder()
                .date(endDate != null ? endDate : LocalDate.now())
                .income(totalIncome)
                .expenses(totalExpenses)
                .build());

        double netProfit = totalIncome - totalExpenses;
        double profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

        SalesChartResponse.SalesMetrics metrics = SalesChartResponse.SalesMetrics.builder()
                .totalIncome(totalIncome)
                .totalExpenses(totalExpenses)
                .netProfit(netProfit)
                .profitMargin(Math.round(profitMargin * 100.0) / 100.0)
                .build();

        return SalesChartResponse.builder()
                .data(dataPoints)
                .metrics(metrics)
                .build();
    }

    @Override
    @Cacheable(value = "payment:methods", unless = "#result == null")
    public PaymentMethodStatsResponse getPaymentMethodStats(LocalDate startDate, LocalDate endDate) {
        log.info("Fetching payment method statistics: {} to {}", startDate, endDate);

        PaymentStatisticsDto paymentStats = paymentServiceClient.getPaymentStatistics(startDate, endDate);
        List<PaymentMethodStatsResponse.PaymentMethodData> methodData = new ArrayList<>();
        double totalAmount = paymentStats.getTotalRevenue() != null ? paymentStats.getTotalRevenue() : 0.0;

        if (paymentStats.getPaymentMethodDistribution() != null) {
            paymentStats.getPaymentMethodDistribution().forEach((method, count) -> {
                // Estimate amount per method (in real scenario, payment-service should provide this)
                Double amount = (count.doubleValue() / paymentStats.getTotalPayments()) * totalAmount;
                Double percentage = (amount / totalAmount) * 100;

                methodData.add(PaymentMethodStatsResponse.PaymentMethodData.builder()
                        .paymentMethod(method)
                        .transactionCount(count)
                        .totalAmount(amount)
                        .percentage(Math.round(percentage * 100.0) / 100.0)
                        .build());
            });
        }

        return PaymentMethodStatsResponse.builder()
                .data(methodData)
                .totalAmount(totalAmount)
                .build();
    }

    // Helper methods
    private Double calculatePercentageChange(Double current, Double previous) {
        if (previous == null || previous == 0) {
            return 0.0;
        }
        double change = ((current - previous) / previous) * 100;
        return Math.round(change * 100.0) / 100.0;
    }

    private String formatCurrency(Double amount) {
        NumberFormat formatter = NumberFormat.getCurrencyInstance(Locale.US);
        return formatter.format(amount);
    }

    private String formatNumber(Long number) {
        return NumberFormat.getNumberInstance(Locale.US).format(number);
    }
}

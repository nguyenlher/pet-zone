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
import com.petstore.statisticsservice.api.dto.response.TopProductResponse;
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

        try {
            // Query all stats in parallel using CompletableFuture with exception handling
            CompletableFuture<PaymentStatisticsDto> paymentStatsFuture = CompletableFuture.supplyAsync(() -> {
                try {
                    return paymentServiceClient.getPaymentStatistics(null, null);
                } catch (Exception e) {
                    log.error("Failed to fetch payment statistics", e);
                    return createDefaultPaymentStats();
                }
            });

            CompletableFuture<OrderStatisticsDto> orderStatsFuture = CompletableFuture.supplyAsync(() -> {
                try {
                    return orderServiceClient.getOrderStatistics(null, null, null);
                } catch (Exception e) {
                    log.error("Failed to fetch order statistics", e);
                    return createDefaultOrderStats();
                }
            });

            CompletableFuture<UserStatisticsDto> userStatsFuture = CompletableFuture.supplyAsync(() -> {
                try {
                    return userServiceClient.getUserStatistics(null, null);
                } catch (Exception e) {
                    log.error("Failed to fetch user statistics", e);
                    return createDefaultUserStats();
                }
            });

            // Previous month stats for comparison
            LocalDate lastMonthStart = LocalDate.now().minusMonths(1).withDayOfMonth(1);
            LocalDate lastMonthEnd = lastMonthStart.plusMonths(1).minusDays(1);

            CompletableFuture<PaymentStatisticsDto> lastMonthPaymentFuture = CompletableFuture.supplyAsync(() -> {
                try {
                    return paymentServiceClient.getPaymentStatistics(lastMonthStart, lastMonthEnd);
                } catch (Exception e) {
                    log.error("Failed to fetch last month payment statistics", e);
                    return createDefaultPaymentStats();
                }
            });

            CompletableFuture<OrderStatisticsDto> lastMonthOrderFuture = CompletableFuture.supplyAsync(() -> {
                try {
                    return orderServiceClient.getOrderStatistics(lastMonthStart, lastMonthEnd, null);
                } catch (Exception e) {
                    log.error("Failed to fetch last month order statistics", e);
                    return createDefaultOrderStats();
                }
            });

            CompletableFuture<UserStatisticsDto> lastMonthUserFuture = CompletableFuture.supplyAsync(() -> {
                try {
                    return userServiceClient.getUserStatistics(lastMonthStart, lastMonthEnd);
                } catch (Exception e) {
                    log.error("Failed to fetch last month user statistics", e);
                    return createDefaultUserStats();
                }
            });

            // Wait for all to complete
            CompletableFuture.allOf(
                    paymentStatsFuture, orderStatsFuture, userStatsFuture,
                    lastMonthPaymentFuture, lastMonthOrderFuture, lastMonthUserFuture).join();

            // Get results with null safety
            PaymentStatisticsDto paymentStats = paymentStatsFuture.join();
            OrderStatisticsDto orderStats = orderStatsFuture.join();
            UserStatisticsDto userStats = userStatsFuture.join();

            PaymentStatisticsDto lastMonthPayment = lastMonthPaymentFuture.join();
            OrderStatisticsDto lastMonthOrder = lastMonthOrderFuture.join();
            UserStatisticsDto lastMonthUser = lastMonthUserFuture.join();

            // Ensure non-null values with defaults
            paymentStats = paymentStats != null ? paymentStats : createDefaultPaymentStats();
            orderStats = orderStats != null ? orderStats : createDefaultOrderStats();
            userStats = userStats != null ? userStats : createDefaultUserStats();
            lastMonthPayment = lastMonthPayment != null ? lastMonthPayment : createDefaultPaymentStats();
            lastMonthOrder = lastMonthOrder != null ? lastMonthOrder : createDefaultOrderStats();
            lastMonthUser = lastMonthUser != null ? lastMonthUser : createDefaultUserStats();

            // Calculate changes with null safety
            Double revenueChange = calculatePercentageChange(
                    paymentStats.getTotalRevenue() != null ? paymentStats.getTotalRevenue() : 0.0,
                    lastMonthPayment.getTotalRevenue() != null ? lastMonthPayment.getTotalRevenue() : 0.0);
            Double ordersChange = calculatePercentageChange(
                    orderStats.getCompletedOrders() != null ? orderStats.getCompletedOrders().doubleValue() : 0.0,
                    lastMonthOrder.getCompletedOrders() != null ? lastMonthOrder.getCompletedOrders().doubleValue()
                            : 0.0);
            Double customersChange = calculatePercentageChange(
                    userStats.getTotalUsers() != null ? userStats.getTotalUsers().doubleValue() : 0.0,
                    lastMonthUser.getNewUsersInPeriod() != null ? lastMonthUser.getNewUsersInPeriod().doubleValue()
                            : 0.0);

            // Build stat cards
            List<DashboardStatsResponse.StatCard> stats = new ArrayList<>();

            stats.add(DashboardStatsResponse.StatCard.builder()
                    .id("total-revenue")
                    .label("Total Revenue")
                    .value(paymentStats.getTotalRevenue() != null ? paymentStats.getTotalRevenue().longValue() : 0L)
                    .formatted(formatCurrency(
                            paymentStats.getTotalRevenue() != null ? paymentStats.getTotalRevenue() : 0.0))
                    .change(revenueChange)
                    .positive(revenueChange >= 0)
                    .icon("DollarSign")
                    .color("bg-emerald-50")
                    .iconColor("text-emerald-600")
                    .build());

            stats.add(DashboardStatsResponse.StatCard.builder()
                    .id("total-orders")
                    .label("Total Orders")
                    .value(orderStats.getCompletedOrders() != null ? orderStats.getCompletedOrders() : 0L)
                    .formatted(formatNumber(
                            orderStats.getCompletedOrders() != null ? orderStats.getCompletedOrders() : 0L))
                    .change(ordersChange)
                    .positive(ordersChange >= 0)
                    .icon("ShoppingBag")
                    .color("bg-blue-50")
                    .iconColor("text-blue-600")
                    .build());

            stats.add(DashboardStatsResponse.StatCard.builder()
                    .id("total-customers")
                    .label("Total Customers")
                    .value(userStats.getTotalUsers() != null ? userStats.getTotalUsers() : 0L)
                    .formatted(formatNumber(userStats.getTotalUsers() != null ? userStats.getTotalUsers() : 0L))
                    .change(customersChange)
                    .positive(customersChange >= 0)
                    .icon("Users")
                    .color("bg-purple-50")
                    .iconColor("text-purple-600")
                    .build());

            stats.add(DashboardStatsResponse.StatCard.builder()
                    .id("pending-orders")
                    .label("Pending Orders")
                    .value(orderStats.getPendingOrders() != null ? orderStats.getPendingOrders() : 0L)
                    .formatted(formatNumber(orderStats.getPendingOrders() != null ? orderStats.getPendingOrders() : 0L))
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
        } catch (Exception e) {
            log.error("Error calculating dashboard statistics", e);
            // Return default dashboard with zero values
            return createDefaultDashboard();
        }
    }

    @Override
    @Cacheable(value = "revenue:stats", unless = "#result == null")
    public RevenueStatsResponse getRevenueStats(LocalDate startDate, LocalDate endDate, String groupBy) {
        log.info("Calculating revenue statistics: {} to {}, groupBy: {}", startDate, endDate, groupBy);

        PaymentStatisticsDto paymentStats = paymentServiceClient.getPaymentStatistics(startDate, endDate);

        List<RevenueStatsResponse.RevenueDataPoint> dataPoints = new ArrayList<>();

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

        try {
            OrderStatisticsDto orderStats = orderServiceClient.getOrderStatistics(startDate, endDate, null);

            if (orderStats == null) {
                log.warn("Order statistics returned null, returning empty response");
                return OrderStatsResponse.builder()
                        .totalOrders(0L)
                        .completedOrders(0L)
                        .pendingOrders(0L)
                        .cancelledOrders(0L)
                        .statusDistribution(new ArrayList<>())
                        .build();
            }

            List<OrderStatsResponse.OrderStatusDistribution> distribution = new ArrayList<>();

            if (orderStats.getStatusDistribution() != null && orderStats.getTotalOrders() != null
                    && orderStats.getTotalOrders() > 0) {
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
                    .totalOrders(orderStats.getTotalOrders() != null ? orderStats.getTotalOrders() : 0L)
                    .completedOrders(orderStats.getCompletedOrders() != null ? orderStats.getCompletedOrders() : 0L)
                    .pendingOrders(orderStats.getPendingOrders() != null ? orderStats.getPendingOrders() : 0L)
                    .cancelledOrders(orderStats.getCancelledOrders() != null ? orderStats.getCancelledOrders() : 0L)
                    .statusDistribution(distribution)
                    .build();
        } catch (Exception e) {
            log.error("Error getting order statistics: {}", e.getMessage(), e);
            return OrderStatsResponse.builder()
                    .totalOrders(0L)
                    .completedOrders(0L)
                    .pendingOrders(0L)
                    .cancelledOrders(0L)
                    .statusDistribution(new ArrayList<>())
                    .build();
        }
    }

    @Override
    @Cacheable(value = "top:pets", unless = "#result == null")
    public Page<TopPetResponse> getTopSellingPets(int limit, LocalDate startDate, LocalDate endDate,
            Pageable pageable) {
        log.info("Fetching top {} selling pets", limit);

        OrderStatisticsDto orderStats = orderServiceClient.getOrderStatistics(startDate, endDate, limit);
        List<TopPetResponse> topPets = new ArrayList<>();

        int rank = 1;
        if (orderStats.getTopSellingPets() != null) {
            for (OrderStatisticsDto.TopSellingPetDto pet : orderStats.getTopSellingPets()) {
                PetStatisticsDto petStats = petServiceClient.getPetStatistics(1);
                String imageUrl = "";
                Double price = 0.0;

                if (petStats.getTopViewedPets() != null && !petStats.getTopViewedPets().isEmpty()) {
                    petStats.getTopViewedPets().stream()
                            .filter(p -> p.getId().equals(pet.getPetId()))
                            .findFirst()
                            .ifPresent(p -> {
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

        try {
            PaymentStatisticsDto paymentStats = paymentServiceClient.getPaymentStatistics(startDate, endDate);

            List<SalesChartResponse.SalesDataPoint> dataPoints = new ArrayList<>();
            double totalIncome = (paymentStats != null && paymentStats.getTotalRevenue() != null)
                    ? paymentStats.getTotalRevenue()
                    : 0.0;
            // For now, expenses are estimated as 70% of income (you can adjust this logic)
            double totalExpenses = totalIncome * 0.7;

            // Generate daily data points for better visualization
            if (startDate != null && endDate != null) {
                LocalDate currentDate = startDate;
                long daysBetween = java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate);
                double dailyIncome = daysBetween > 0 ? totalIncome / daysBetween : totalIncome;
                double dailyExpenses = daysBetween > 0 ? totalExpenses / daysBetween : totalExpenses;

                while (!currentDate.isAfter(endDate)) {
                    dataPoints.add(SalesChartResponse.SalesDataPoint.builder()
                            .date(currentDate)
                            .income(dailyIncome)
                            .expenses(dailyExpenses)
                            .build());
                    currentDate = currentDate.plusDays(1);
                }
            } else {
                // Create a single data point
                dataPoints.add(SalesChartResponse.SalesDataPoint.builder()
                        .date(endDate != null ? endDate : LocalDate.now())
                        .income(totalIncome)
                        .expenses(totalExpenses)
                        .build());
            }

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
        } catch (Exception e) {
            log.error("Error getting sales chart data: {}", e.getMessage(), e);
            // Return empty data instead of throwing exception
            return SalesChartResponse.builder()
                    .data(new ArrayList<>())
                    .metrics(SalesChartResponse.SalesMetrics.builder()
                            .totalIncome(0.0)
                            .totalExpenses(0.0)
                            .netProfit(0.0)
                            .profitMargin(0.0)
                            .build())
                    .build();
        }
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
                // Estimate amount per method (in real scenario, payment-service should provide
                // this)
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

    @Override
    @Cacheable(value = "top:products", unless = "#result == null")
    public Page<TopProductResponse> getTopSellingProducts(int limit, LocalDate startDate, LocalDate endDate,
            Pageable pageable) {
        log.info("Fetching top {} selling products", limit);

        try {
            OrderStatisticsDto orderStats = orderServiceClient.getOrderStatistics(startDate, endDate, limit);
            List<TopProductResponse> topProducts = new ArrayList<>();

            int rank = 1;
            if (orderStats.getTopSellingPets() != null) {
                for (OrderStatisticsDto.TopSellingPetDto pet : orderStats.getTopSellingPets()) {
                    topProducts.add(TopProductResponse.builder()
                            .id(java.util.UUID.fromString(pet.getPetId()))
                            .name(pet.getPetName())
                            .imageUrl("")
                            .price(0.0)
                            .quantitySold(pet.getQuantitySold())
                            .totalRevenue(pet.getTotalRevenue())
                            .rank(rank++)
                            .category("Pet")
                            .build());
                }
            }

            return new PageImpl<>(topProducts, pageable, topProducts.size());
        } catch (Exception e) {
            log.error("Error getting top selling products: {}", e.getMessage(), e);
            return new PageImpl<>(new ArrayList<>(), pageable, 0);
        }
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

    // Default DTO creators for fallback when services are unavailable
    private PaymentStatisticsDto createDefaultPaymentStats() {
        PaymentStatisticsDto dto = new PaymentStatisticsDto();
        dto.setTotalRevenue(0.0);
        dto.setTotalPayments(0L);
        dto.setSuccessfulPayments(0L);
        dto.setFailedPayments(0L);
        dto.setPaymentMethodDistribution(new java.util.HashMap<>());
        return dto;
    }

    private OrderStatisticsDto createDefaultOrderStats() {
        OrderStatisticsDto dto = new OrderStatisticsDto();
        dto.setTotalOrders(0L);
        dto.setCompletedOrders(0L);
        dto.setPendingOrders(0L);
        dto.setCancelledOrders(0L);
        dto.setStatusDistribution(new java.util.HashMap<>());
        dto.setTopSellingPets(new java.util.ArrayList<>());
        return dto;
    }

    private UserStatisticsDto createDefaultUserStats() {
        UserStatisticsDto dto = new UserStatisticsDto();
        dto.setTotalUsers(0L);
        dto.setNewUsersInPeriod(0L);
        dto.setActiveUsers(0L);
        return dto;
    }

    private DashboardStatsResponse createDefaultDashboard() {
        List<DashboardStatsResponse.StatCard> stats = new ArrayList<>();

        stats.add(DashboardStatsResponse.StatCard.builder()
                .id("total-revenue")
                .label("Total Revenue")
                .value(0L)
                .formatted("$0.00")
                .change(0.0)
                .positive(true)
                .icon("DollarSign")
                .color("bg-emerald-50")
                .iconColor("text-emerald-600")
                .build());

        stats.add(DashboardStatsResponse.StatCard.builder()
                .id("total-orders")
                .label("Total Orders")
                .value(0L)
                .formatted("0")
                .change(0.0)
                .positive(true)
                .icon("ShoppingBag")
                .color("bg-blue-50")
                .iconColor("text-blue-600")
                .build());

        stats.add(DashboardStatsResponse.StatCard.builder()
                .id("total-customers")
                .label("Total Customers")
                .value(0L)
                .formatted("0")
                .change(0.0)
                .positive(true)
                .icon("Users")
                .color("bg-purple-50")
                .iconColor("text-purple-600")
                .build());

        stats.add(DashboardStatsResponse.StatCard.builder()
                .id("pending-orders")
                .label("Pending Orders")
                .value(0L)
                .formatted("0")
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
}

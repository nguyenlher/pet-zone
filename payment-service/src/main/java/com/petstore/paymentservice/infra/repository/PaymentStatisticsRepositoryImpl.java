package com.petstore.paymentservice.infra.repository;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.petstore.paymentservice.domain.repository.PaymentStatisticsRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Repository
@RequiredArgsConstructor
@Slf4j
public class PaymentStatisticsRepositoryImpl implements PaymentStatisticsRepository {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public Long countTotalPayments() {
        String sql = "SELECT COUNT(*) FROM payments";
        return jdbcTemplate.queryForObject(sql, Long.class);
    }

    @Override
    public Long countPaymentsByStatus(String status) {
        String sql = "SELECT COUNT(*) FROM payments WHERE status = ?";
        return jdbcTemplate.queryForObject(sql, Long.class, status);
    }

    @Override
    public Long countPaymentsByStatusAndDateRange(String status, LocalDate startDate, LocalDate endDate) {
        String sql = """
                SELECT COUNT(*)
                FROM payments
                WHERE status = ?
                  AND (? IS NULL OR created_at >= ?)
                  AND (? IS NULL OR created_at <= ?)
                """;
        return jdbcTemplate.queryForObject(sql, Long.class, status, startDate, startDate, endDate, endDate);
    }

    @Override
    public Double getTotalRevenue(LocalDate startDate, LocalDate endDate) {
        String sql = """
                SELECT COALESCE(SUM(amount), 0)
                FROM payments
                WHERE status = 'SUCCESS'
                  AND (? IS NULL OR created_at >= ?)
                  AND (? IS NULL OR created_at <= ?)
                """;
        return jdbcTemplate.queryForObject(sql, Double.class, startDate, startDate, endDate, endDate);
    }

    @Override
    public Map<String, Long> getPaymentMethodDistribution(LocalDate startDate, LocalDate endDate) {
        String sql = """
                SELECT
                    payment_method,
                    COUNT(*) as count
                FROM payments
                WHERE (? IS NULL OR created_at >= ?)
                  AND (? IS NULL OR created_at <= ?)
                GROUP BY payment_method
                ORDER BY count DESC
                """;

        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, startDate, startDate, endDate, endDate);
        Map<String, Long> distribution = new HashMap<>();

        for (Map<String, Object> row : rows) {
            String method = (String) row.get("payment_method");
            Long count = ((Number) row.get("count")).longValue();
            distribution.put(method, count);
        }

        return distribution;
    }

    @Override
    public Map<String, Long> getStatusDistribution(LocalDate startDate, LocalDate endDate) {
        String sql = """
                SELECT
                    status,
                    COUNT(*) as count
                FROM payments
                WHERE (? IS NULL OR created_at >= ?)
                  AND (? IS NULL OR created_at <= ?)
                GROUP BY status
                ORDER BY count DESC
                """;

        List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql, startDate, startDate, endDate, endDate);
        Map<String, Long> distribution = new HashMap<>();

        for (Map<String, Object> row : rows) {
            String status = (String) row.get("status");
            Long count = ((Number) row.get("count")).longValue();
            distribution.put(status, count);
        }

        return distribution;
    }
}

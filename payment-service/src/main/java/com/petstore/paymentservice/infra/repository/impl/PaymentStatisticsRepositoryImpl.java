package com.petstore.paymentservice.infra.repository.impl;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import com.petstore.paymentservice.domain.repository.PaymentStatisticsRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Repository
@RequiredArgsConstructor
@Slf4j
public class PaymentStatisticsRepositoryImpl implements PaymentStatisticsRepository {

    private final JdbcTemplate jdbcTemplate;
    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

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
                WHERE status = :status
                  AND (CAST(:startDate AS DATE) IS NULL OR created_at >= CAST(:startDate AS DATE))
                  AND (CAST(:endDate AS DATE) IS NULL OR created_at <= CAST(:endDate AS DATE))
                """;
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("status", status)
                .addValue("startDate", startDate, java.sql.Types.DATE)
                .addValue("endDate", endDate, java.sql.Types.DATE);
        return namedParameterJdbcTemplate.queryForObject(sql, params, Long.class);
    }

    @Override
    public Double getTotalRevenue(LocalDate startDate, LocalDate endDate) {
        String sql = """
                SELECT COALESCE(SUM(amount), 0.0)
                FROM payments
                WHERE status = 'SUCCESS'
                  AND (CAST(:startDate AS DATE) IS NULL OR created_at >= CAST(:startDate AS DATE))
                  AND (CAST(:endDate AS DATE) IS NULL OR created_at <= CAST(:endDate AS DATE))
                """;
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("startDate", startDate, java.sql.Types.DATE)
                .addValue("endDate", endDate, java.sql.Types.DATE);
        
        Object result = namedParameterJdbcTemplate.queryForObject(sql, params, Object.class);
        if (result == null) {
            return 0.0;
        }
        if (result instanceof Number) {
            return ((Number) result).doubleValue();
        }
        return 0.0;
    }

    @Override
    public Map<String, Long> getPaymentMethodDistribution(LocalDate startDate, LocalDate endDate) {
        String sql = """
                SELECT
                    payment_method,
                    COUNT(*) as count
                FROM payments
                WHERE (CAST(:startDate AS DATE) IS NULL OR created_at >= CAST(:startDate AS DATE))
                  AND (CAST(:endDate AS DATE) IS NULL OR created_at <= CAST(:endDate AS DATE))
                GROUP BY payment_method
                ORDER BY count DESC
                """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("startDate", startDate, java.sql.Types.DATE)
                .addValue("endDate", endDate, java.sql.Types.DATE);

        List<Map<String, Object>> rows = namedParameterJdbcTemplate.queryForList(sql, params);
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
                WHERE (CAST(:startDate AS DATE) IS NULL OR created_at >= CAST(:startDate AS DATE))
                  AND (CAST(:endDate AS DATE) IS NULL OR created_at <= CAST(:endDate AS DATE))
                GROUP BY status
                ORDER BY count DESC
                """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("startDate", startDate, java.sql.Types.DATE)
                .addValue("endDate", endDate, java.sql.Types.DATE);

        List<Map<String, Object>> rows = namedParameterJdbcTemplate.queryForList(sql, params);
        Map<String, Long> distribution = new HashMap<>();

        for (Map<String, Object> row : rows) {
            String status = (String) row.get("status");
            Long count = ((Number) row.get("count")).longValue();
            distribution.put(status, count);
        }

        return distribution;
    }
}

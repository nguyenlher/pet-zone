package com.petstore.orderservice.infra.repository.impl;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import com.petstore.orderservice.domain.repository.OrderStatisticsRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Repository
@RequiredArgsConstructor
@Slf4j
public class OrderStatisticsRepositoryImpl implements OrderStatisticsRepository {

    private final JdbcTemplate jdbcTemplate;
    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Override
    public Long countTotalOrders() {
        String sql = "SELECT COUNT(*) FROM orders";
        return jdbcTemplate.queryForObject(sql, Long.class);
    }

    @Override
    public Long countOrdersByStatus(String status) {
        String sql = "SELECT COUNT(*) FROM orders WHERE status = ?";
        return jdbcTemplate.queryForObject(sql, Long.class, status);
    }

    @Override
    public Long countOrdersByStatusAndDateRange(String status, LocalDate startDate, LocalDate endDate) {
        String sql = """
                SELECT COUNT(*)
                FROM orders
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
    public Map<String, Long> getOrderStatusDistribution(LocalDate startDate, LocalDate endDate) {
        String sql = """
                SELECT
                    status,
                    COUNT(*) as count
                FROM orders
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

    @Override
    public List<TopSellingPetData> getTopSellingPets(int limit, LocalDate startDate, LocalDate endDate) {
        String sql = """
                SELECT
                    oi.item_id as pet_id,
                    oi.item_name as pet_name,
                    SUM(oi.quantity) as quantity_sold,
                    SUM(oi.subtotal_amount) as total_revenue
                FROM order_items oi
                JOIN orders o ON oi.order_id = o.id
                WHERE o.status = 'COMPLETED' AND oi.item_type = 'PET'
                  AND (CAST(:startDate AS DATE) IS NULL OR o.created_at >= CAST(:startDate AS DATE))
                  AND (CAST(:endDate AS DATE) IS NULL OR o.created_at <= CAST(:endDate AS DATE))
                GROUP BY oi.item_id, oi.item_name
                ORDER BY quantity_sold DESC
                LIMIT :limit
                """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("startDate", startDate, java.sql.Types.DATE)
                .addValue("endDate", endDate, java.sql.Types.DATE)
                .addValue("limit", limit);

        return namedParameterJdbcTemplate.query(sql, params,
                (rs, rowNum) -> new TopSellingPetData(
                        rs.getString("pet_id"),
                        rs.getString("pet_name"),
                        rs.getLong("quantity_sold"),
                        rs.getDouble("total_revenue")));
    }
}

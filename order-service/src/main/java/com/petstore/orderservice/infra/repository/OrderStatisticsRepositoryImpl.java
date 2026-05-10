package com.petstore.orderservice.infra.repository;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.petstore.orderservice.domain.repository.OrderStatisticsRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Repository
@RequiredArgsConstructor
@Slf4j
public class OrderStatisticsRepositoryImpl implements OrderStatisticsRepository {

    private final JdbcTemplate jdbcTemplate;

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
                WHERE status = ?
                  AND (? IS NULL OR created_at >= ?)
                  AND (? IS NULL OR created_at <= ?)
                """;
        return jdbcTemplate.queryForObject(sql, Long.class, status, startDate, startDate, endDate, endDate);
    }

    @Override
    public Map<String, Long> getOrderStatusDistribution(LocalDate startDate, LocalDate endDate) {
        String sql = """
                SELECT
                    status,
                    COUNT(*) as count
                FROM orders
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

    @Override
    public List<TopSellingPetData> getTopSellingPets(int limit, LocalDate startDate, LocalDate endDate) {
        String sql = """
                SELECT
                    oi.pet_id,
                    oi.pet_name,
                    SUM(oi.quantity) as quantity_sold,
                    SUM(oi.subtotal_amount) as total_revenue
                FROM order_items oi
                JOIN orders o ON oi.order_id = o.id
                WHERE o.status = 'COMPLETED'
                  AND (? IS NULL OR o.created_at >= ?)
                  AND (? IS NULL OR o.created_at <= ?)
                GROUP BY oi.pet_id, oi.pet_name
                ORDER BY quantity_sold DESC
                LIMIT ?
                """;

        return jdbcTemplate.query(sql,
                (rs, rowNum) -> new TopSellingPetData(
                        rs.getString("pet_id"),
                        rs.getString("pet_name"),
                        rs.getLong("quantity_sold"),
                        rs.getDouble("total_revenue")),
                startDate, startDate, endDate, endDate, limit);
    }
}

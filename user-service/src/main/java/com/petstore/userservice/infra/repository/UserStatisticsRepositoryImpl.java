package com.petstore.userservice.infra.repository;

import java.time.LocalDate;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.petstore.userservice.domain.repository.UserStatisticsRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Repository
@RequiredArgsConstructor
@Slf4j
public class UserStatisticsRepositoryImpl implements UserStatisticsRepository {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public Long countTotalUsers() {
        String sql = "SELECT COUNT(*) FROM users";
        return jdbcTemplate.queryForObject(sql, Long.class);
    }

    @Override
    public Long countActiveUsers() {
        String sql = "SELECT COUNT(*) FROM users WHERE is_active = true";
        return jdbcTemplate.queryForObject(sql, Long.class);
    }

    @Override
    public Long countInactiveUsers() {
        String sql = "SELECT COUNT(*) FROM users WHERE is_active = false";
        return jdbcTemplate.queryForObject(sql, Long.class);
    }

    @Override
    public Long countNewUsers(LocalDate startDate, LocalDate endDate) {
        String sql = """
                SELECT COUNT(*)
                FROM users
                WHERE (? IS NULL OR created_at >= ?)
                  AND (? IS NULL OR created_at <= ?)
                """;
        return jdbcTemplate.queryForObject(sql, Long.class, startDate, startDate, endDate, endDate);
    }
}

package com.petstore.userservice.domain.repository;

import java.time.LocalDate;

public interface UserStatisticsRepository {
    Long countTotalUsers();
    Long countActiveUsers();
    Long countInactiveUsers();
    Long countNewUsers(LocalDate startDate, LocalDate endDate);
}

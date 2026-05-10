package com.petstore.petservice.domain.service;

import com.petstore.petservice.api.dto.PetStatisticsDto;

public interface PetStatisticsService {
    PetStatisticsDto getPetStatistics(Integer topPetsLimit);
}

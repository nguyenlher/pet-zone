package com.petstore.statisticsservice.infra.client;

import com.petstore.statisticsservice.api.dto.PetStatisticsDto;

public interface PetServiceClient {
    PetStatisticsDto getPetStatistics(Integer topPetsLimit);
}

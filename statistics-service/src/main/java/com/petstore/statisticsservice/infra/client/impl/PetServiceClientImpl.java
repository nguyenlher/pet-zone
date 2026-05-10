package com.petstore.statisticsservice.infra.client.impl;

import com.petstore.statisticsservice.api.dto.PetStatisticsDto;
import com.petstore.statisticsservice.infra.client.PetServiceClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
@RequiredArgsConstructor
@Slf4j
public class PetServiceClientImpl implements PetServiceClient {

    @Qualifier("petRestClient")
    private final RestClient petRestClient;

    @Override
    public PetStatisticsDto getPetStatistics(Integer topPetsLimit) {
        log.info("Calling pet-service private API for statistics");
        
        try {
            return petRestClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/private/pets/statistics")
                            .queryParamIfPresent("topPetsLimit", java.util.Optional.ofNullable(topPetsLimit))
                            .build())
                    .retrieve()
                    .body(PetStatisticsDto.class);
        } catch (Exception e) {
            log.error("Error calling pet-service: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to get pet statistics", e);
        }
    }
}

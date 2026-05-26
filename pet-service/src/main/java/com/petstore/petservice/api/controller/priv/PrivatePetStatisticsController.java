package com.petstore.petservice.api.controller.priv;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.petstore.petservice.api.dto.PetStatisticsDto;
import com.petstore.petservice.domain.service.PetStatisticsService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Private Pet Statistics Controller for inter-service communication
 * Used by statistics-service to get pet statistics data
 */
@RestController
@RequestMapping("/private/pets/statistics")
@RequiredArgsConstructor
@Slf4j
public class PrivatePetStatisticsController {

    private final PetStatisticsService petStatisticsService;

    @GetMapping
    public ResponseEntity<PetStatisticsDto> getPetStatistics(
            @RequestParam(required = false, defaultValue = "10") Integer topPetsLimit
    ) {
        log.info("Private API: Getting pet statistics");
        PetStatisticsDto statistics = petStatisticsService.getPetStatistics(topPetsLimit);
        return ResponseEntity.ok(statistics);
    }
}

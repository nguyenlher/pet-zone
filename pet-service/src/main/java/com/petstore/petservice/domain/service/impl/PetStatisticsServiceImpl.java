package com.petstore.petservice.domain.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.petstore.petservice.api.dto.PetStatisticsDto;
import com.petstore.petservice.domain.repository.PetStatisticsRepository;
import com.petstore.petservice.domain.service.PetStatisticsService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PetStatisticsServiceImpl implements PetStatisticsService {

    private final PetStatisticsRepository petStatisticsRepository;

    @Override
    public PetStatisticsDto getPetStatistics(Integer topPetsLimit) {
        log.info("Getting pet statistics");
        
        int limit = topPetsLimit != null ? topPetsLimit : 10;
        
        Long totalPets = petStatisticsRepository.countTotalPets();
        Long availablePets = petStatisticsRepository.countPetsByStatus("AVAILABLE");
        Long soldPets = petStatisticsRepository.countPetsByStatus("SOLD");
        Long reservedPets = petStatisticsRepository.countPetsByStatus("RESERVED");
        
        List<PetStatisticsDto.TopPetDto> topViewedPets = petStatisticsRepository
            .getTopViewedPets(limit)
            .stream()
            .map(data -> PetStatisticsDto.TopPetDto.builder()
                .id(data.id())
                .name(data.name())
                .imageUrl(data.imageUrl())
                .price(data.price())
                .viewCount(data.viewCount())
                .build())
            .toList();
        
        return PetStatisticsDto.builder()
            .totalPets(totalPets)
            .availablePets(availablePets)
            .soldPets(soldPets)
            .reservedPets(reservedPets)
            .topViewedPets(topViewedPets)
            .build();
    }
}

package com.petstore.petservice.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.petstore.petservice.dto.response.BreedResponse;
import com.petstore.petservice.model.enums.PetType;
import com.petstore.petservice.repository.jpa.JpaBreedRepository;
import com.petstore.petservice.service.BreedService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BreedServiceImpl implements BreedService {

    private final JpaBreedRepository breedRepository;

    @Override
    public List<BreedResponse> getBreedsByType(PetType petType) {
        return breedRepository.findByPetTypeAndIsActiveTrue(petType).stream()
                .map(e -> BreedResponse.builder()
                        .id(e.getId())
                        .name(e.getName())
                        .petType(e.getPetType())
                        .description(e.getDescription())
                        .avgRating(e.getAvgRating())
                        .totalReviews(e.getTotalReviews())
                        .imageUrl(e.getImageUrl())
                        .isActive(e.getIsActive())
                        .createdAt(e.getCreatedAt())
                        .updatedAt(e.getUpdatedAt())
                        .build())
                .toList();
    }
}

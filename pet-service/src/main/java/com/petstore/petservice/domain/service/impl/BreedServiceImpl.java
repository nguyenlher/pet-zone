package com.petstore.petservice.domain.service.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.petstore.petservice.api.dto.request.BreedCreateRequest;
import com.petstore.petservice.api.dto.request.BreedUpdateRequest;
import com.petstore.petservice.api.dto.response.BreedResponse;
import com.petstore.petservice.domain.model.Breed;
import com.petstore.petservice.domain.repository.BreedRepository;
import com.petstore.petservice.domain.repository.PetTypeRepository;
import com.petstore.petservice.domain.service.BreedService;
import com.petstore.petservice.exception.ResourceNotFoundException;
import com.petstore.petservice.infra.mapper.BreedMapper;
import com.petstore.petservice.infra.repository.jpa.JpaBreedRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BreedServiceImpl implements BreedService {

    private final JpaBreedRepository jpaBreedRepository;
    private final BreedRepository breedRepository;
    private final PetTypeRepository petTypeRepository;
    private final BreedMapper breedMapper;

    @Override
    @Transactional
    public BreedResponse create(BreedCreateRequest request) {
        if (!petTypeRepository.existsById(request.getPetTypeId())) {
            throw new ResourceNotFoundException("Pet type not found with id: " + request.getPetTypeId());
        }

        Breed breed = breedMapper.toDomain(request);
        Breed savedBreed = breedMapper.toDomain(jpaBreedRepository.save(breedMapper.toEntity(breed)));
        
        return breedMapper.toResponse(savedBreed);
    }

    @Override
    @Transactional
    public BreedResponse update(UUID id, BreedUpdateRequest request) {
        Breed existingBreed = breedRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Breed not found with id: " + id));

        breedMapper.updateDomain(existingBreed, request);
        Breed updatedBreed = breedMapper.toDomain(jpaBreedRepository.save(breedMapper.toEntity(existingBreed)));
        
        return breedMapper.toResponse(updatedBreed);
    }

    @Override
    @Transactional(readOnly = true)
    public BreedResponse getById(UUID id) {
        Breed breed = breedRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Breed not found with id: " + id));
        
        return breedMapper.toResponse(breed);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BreedResponse> getByPetTypeId(UUID petTypeId) {
        return jpaBreedRepository.findAll().stream()
                .map(breedMapper::toDomain)
                .filter(breed -> breed.getPetTypeId().equals(petTypeId))
                .map(breedMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BreedResponse> getAll() {
        return jpaBreedRepository.findAll().stream()
                .map(breedMapper::toDomain)
                .map(breedMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        if (!breedRepository.existsById(id)) {
            throw new ResourceNotFoundException("Breed not found with id: " + id);
        }
        jpaBreedRepository.deleteById(id);
    }
}

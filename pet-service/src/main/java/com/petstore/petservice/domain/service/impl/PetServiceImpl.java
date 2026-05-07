package com.petstore.petservice.domain.service.impl;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.petstore.petservice.api.dto.request.PetCreateRequest;
import com.petstore.petservice.api.dto.request.PetUpdateRequest;
import com.petstore.petservice.api.dto.response.PetDetailResponse;
import com.petstore.petservice.api.dto.response.PetResponse;
import com.petstore.petservice.domain.model.Pet;
import com.petstore.petservice.domain.model.enums.PetStatus;
import com.petstore.petservice.domain.repository.BreedRepository;
import com.petstore.petservice.domain.repository.PetRepository;
import com.petstore.petservice.domain.service.PetService;
import com.petstore.petservice.exception.ResourceNotFoundException;
import com.petstore.petservice.infra.mapper.PetMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PetServiceImpl implements PetService {

    private final PetRepository petRepository;
    private final BreedRepository breedRepository;
    private final PetMapper petMapper;

    @Override
    @Transactional
    public PetDetailResponse create(PetCreateRequest request) {
        if (request.getBreedId() != null && !breedRepository.existsById(request.getBreedId())) {
            throw new ResourceNotFoundException("Breed not found with id: " + request.getBreedId());
        }

        Pet pet = petMapper.toDomain(request);
        Pet savedPet = petRepository.save(pet);
        
        return petMapper.toDetailResponse(savedPet);
    }

    @Override
    @Transactional
    public PetDetailResponse update(UUID id, PetUpdateRequest request) {
        Pet existingPet = petRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found with id: " + id));

        if (request.getBreedId() != null && !breedRepository.existsById(request.getBreedId())) {
            throw new ResourceNotFoundException("Breed not found with id: " + request.getBreedId());
        }

        petMapper.updateDomain(existingPet, request);
        Pet updatedPet = petRepository.save(existingPet);
        
        return petMapper.toDetailResponse(updatedPet);
    }

    @Override
    @Transactional(readOnly = true)
    public PetDetailResponse getById(UUID id) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found with id: " + id));
        
        return petMapper.toDetailResponse(pet);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PetResponse> getByStatus(PetStatus status, Pageable pageable) {
        Page<Pet> pets = petRepository.findByStatus(status, pageable);
        return pets.map(petMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PetResponse> getAll(Pageable pageable) {
        Page<Pet> pets = petRepository.findAll(pageable);
        return pets.map(petMapper::toResponse);
    }

    @Override
    @Transactional
    public void incrementViewCount(UUID id) {
        if (!petRepository.existsById(id)) {
            throw new ResourceNotFoundException("Pet not found with id: " + id);
        }
        petRepository.incrementViewCount(id);
    }

    @Override
    @Transactional
    public void updateStatus(UUID id, PetStatus status) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found with id: " + id));
        
        pet.setStatus(status);
        petRepository.save(pet);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean checkAvailability(UUID id) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found with id: " + id));
        
        return pet.getStatus() == PetStatus.AVAILABLE;
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        if (!petRepository.existsById(id)) {
            throw new ResourceNotFoundException("Pet not found with id: " + id);
        }
        petRepository.deleteById(id);
    }
}

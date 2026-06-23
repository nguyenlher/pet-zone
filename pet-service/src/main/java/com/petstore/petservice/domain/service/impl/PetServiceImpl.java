package com.petstore.petservice.domain.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.petstore.petservice.api.dto.request.Pet3DModelSaveRequest;
import com.petstore.petservice.api.dto.request.PetCreateRequest;
import com.petstore.petservice.api.dto.request.PetUpdateRequest;
import com.petstore.petservice.api.dto.response.Pet3DModelResponse;
import com.petstore.petservice.api.dto.response.PetDetailResponse;
import com.petstore.petservice.api.dto.response.PetResponse;
import com.petstore.petservice.domain.model.Breed;
import com.petstore.petservice.domain.model.Pet;
import com.petstore.petservice.domain.model.Pet3DModel;
import com.petstore.petservice.domain.model.PetType;
import com.petstore.petservice.domain.model.enums.PetStatus;
import com.petstore.petservice.domain.repository.BreedRepository;
import com.petstore.petservice.domain.repository.PetRepository;
import com.petstore.petservice.domain.repository.PetTypeRepository;
import com.petstore.petservice.domain.service.PetService;
import com.petstore.petservice.exception.ResourceNotFoundException;
import com.petstore.petservice.infra.mapper.Pet3DModelMapper;
import com.petstore.petservice.infra.mapper.PetMapper;
import com.petstore.petservice.infra.repository.jpa.JpaPet3DModelRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PetServiceImpl implements PetService {

    private final PetRepository petRepository;
    private final BreedRepository breedRepository;
    private final PetTypeRepository petTypeRepository;
    private final PetMapper petMapper;
    private final JpaPet3DModelRepository pet3DModelRepository;
    private final Pet3DModelMapper pet3DModelMapper;

    @Override
    @Transactional
    public PetDetailResponse create(PetCreateRequest request) {
        if (request.getBreedId() != null && !breedRepository.existsById(request.getBreedId())) {
            throw new ResourceNotFoundException("Breed not found with id: " + request.getBreedId());
        }

        Pet pet = petMapper.toDomain(request);
        Pet savedPet = petRepository.save(pet);
        
        UUID petTypeId = getPetTypeId(savedPet.getBreedId());
        String breedName = getBreedName(savedPet.getBreedId());
        String petTypeName = getPetTypeName(savedPet.getBreedId());
        return petMapper.toDetailResponseWithBreedAndType(savedPet, petTypeId, breedName, petTypeName);
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
        
        UUID petTypeId = getPetTypeId(updatedPet.getBreedId());
        String breedName = getBreedName(updatedPet.getBreedId());
        String petTypeName = getPetTypeName(updatedPet.getBreedId());
        return petMapper.toDetailResponseWithBreedAndType(updatedPet, petTypeId, breedName, petTypeName);
    }

    @Override
    @Transactional(readOnly = true)
    public PetDetailResponse getById(UUID id) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found with id: " + id));
        
        UUID petTypeId = getPetTypeId(pet.getBreedId());
        String breedName = getBreedName(pet.getBreedId());
        String petTypeName = getPetTypeName(pet.getBreedId());
        return petMapper.toDetailResponseWithBreedAndType(pet, petTypeId, breedName, petTypeName);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PetResponse> getByStatus(PetStatus status, Pageable pageable) {
        Page<Pet> pets = petRepository.findByStatus(status, pageable);
        return mapPetsToResponseWithBreeds(pets);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PetResponse> getAll(Pageable pageable) {
        Page<Pet> pets = petRepository.findAll(pageable);
        return mapPetsToResponseWithBreeds(pets);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PetResponse> getPetsWithFilters(BigDecimal minPrice, BigDecimal maxPrice, PetStatus status, String keyword, Pageable pageable) {
        Page<Pet> pets = petRepository.findWithFilters(minPrice, maxPrice, status, keyword, pageable);
        return mapPetsToResponseWithBreeds(pets);
    }
    
    /**
     * Batch fetch breeds and map pets to responses
     * This method solves N+1 query problem by fetching all breeds and pet types in batch queries
     */
    private Page<PetResponse> mapPetsToResponseWithBreeds(Page<Pet> pets) {
        if (pets.isEmpty()) {
            return Page.empty(pets.getPageable());
        }
        
        // Step 1: Collect unique breed IDs
        Set<UUID> breedIds = pets.getContent().stream()
                .map(Pet::getBreedId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        
        // Step 2: Batch fetch all breeds in one query
        Map<UUID, Breed> breedMap = new java.util.HashMap<>();
        if (!breedIds.isEmpty()) {
            List<Breed> breeds = breedRepository.findAllByIdIn(new ArrayList<>(breedIds));
            for (Breed breed : breeds) {
                breedMap.put(breed.getId(), breed);
            }
        }
        
        // Step 3: Collect unique pet type IDs from breeds
        Set<UUID> petTypeIds = breedMap.values().stream()
                .map(Breed::getPetTypeId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        
        // Step 4: Batch fetch all pet types in one query
        Map<UUID, String> petTypeNameMap = new java.util.HashMap<>();
        if (!petTypeIds.isEmpty()) {
            List<PetType> petTypes = petTypeRepository.findAll().stream()
                    .filter(pt -> petTypeIds.contains(pt.getId()))
                    .collect(Collectors.toList());
            for (PetType petType : petTypes) {
                petTypeNameMap.put(petType.getId(), petType.getName());
            }
        }
        
        // Step 5: Map pets to responses with breed names and pet type names
        List<PetResponse> responses = pets.getContent().stream()
                .map(pet -> {
                    Breed breed = breedMap.get(pet.getBreedId());
                    String breedName = breed != null ? breed.getName() : null;
                    UUID petTypeId = breed != null ? breed.getPetTypeId() : null;
                    String petTypeName = breed != null ? petTypeNameMap.get(breed.getPetTypeId()) : null;
                    return petMapper.toResponseWithBreedAndType(pet, petTypeId, breedName, petTypeName);
                })
                .collect(Collectors.toList());
        
        return new PageImpl<>(responses, pets.getPageable(), pets.getTotalElements());
    }
    
    /**
     * Get breed name by ID (used for single pet operations)
     */
    private String getBreedName(UUID breedId) {
        if (breedId == null) {
            return null;
        }
        return breedRepository.findById(breedId)
                .map(Breed::getName)
                .orElse(null);
    }
    
    /**
     * Get pet type name by breed ID (used for single pet operations)
     */
    private String getPetTypeName(UUID breedId) {
        if (breedId == null) {
            return null;
        }
        Breed breed = breedRepository.findById(breedId).orElse(null);
        if (breed == null || breed.getPetTypeId() == null) {
            return null;
        }
        return petTypeRepository.findById(breed.getPetTypeId())
                .map(PetType::getName)
                .orElse(null);
    }
    
    /**
     * Get pet type ID by breed ID (used for single pet operations)
     */
    private UUID getPetTypeId(UUID breedId) {
        if (breedId == null) {
            return null;
        }
        return breedRepository.findById(breedId)
                .map(Breed::getPetTypeId)
                .orElse(null);
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

    @Override
    @Transactional
    public Pet3DModelResponse save3DModel(Pet3DModelSaveRequest request) {
        // Verify pet exists
        Pet pet = petRepository.findById(request.getPetId())
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found with id: " + request.getPetId()));
        
        // Create or update 3D model
        Pet3DModel model3d;
        if (pet.getModel3d() != null) {
            // Update existing model
            model3d = pet.getModel3d();
            model3d.setModelUrl(request.getModelUrl());
            model3d.setSourceImageUrl(request.getSourceImageUrl());
        } else {
            // Create new model
            model3d = Pet3DModel.builder()
                    .petId(request.getPetId())
                    .modelUrl(request.getModelUrl())
                    .sourceImageUrl(request.getSourceImageUrl())
                    .createdAt(LocalDateTime.now())
                    .build();
        }
        
        // Save to database
        var entity = pet3DModelMapper.toEntity(model3d);
        entity.setPet(petMapper.toEntity(pet));
        var savedEntity = pet3DModelRepository.save(entity);
        
        // Convert to response
        Pet3DModel savedModel = pet3DModelMapper.toDomain(savedEntity);
        return Pet3DModelResponse.builder()
                .id(savedModel.getId())
                .petId(savedModel.getPetId())
                .modelUrl(savedModel.getModelUrl())
                .sourceImageUrl(savedModel.getSourceImageUrl())
                .createdAt(savedModel.getCreatedAt())
                .build();
    }
}

package com.petstore.petservice.service.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.petstore.petservice.dto.request.PetTypeCreateRequest;
import com.petstore.petservice.dto.request.PetTypeUpdateRequest;
import com.petstore.petservice.dto.response.PetTypeResponse;
import com.petstore.petservice.exception.ResourceNotFoundException;
import com.petstore.petservice.mapper.PetTypeMapper;
import com.petstore.petservice.model.PetType;
import com.petstore.petservice.repository.PetTypeRepository;
import com.petstore.petservice.service.PetTypeService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PetTypeServiceImpl implements PetTypeService {

    private final PetTypeRepository petTypeRepository;
    private final PetTypeMapper petTypeMapper;

    @Override
    @Transactional
    public PetTypeResponse create(PetTypeCreateRequest request) {
        PetType petType = PetType.builder()
                .name(request.getName())
                .description(request.getDescription())
                .iconUrl(request.getIconUrl())
                .isActive(true)
                .displayOrder(request.getDisplayOrder())
                .build();
        
        PetType savedPetType = petTypeRepository.save(petType);
        return petTypeMapper.toResponse(savedPetType);
    }

    @Override
    @Transactional
    public PetTypeResponse update(UUID id, PetTypeUpdateRequest request) {
        PetType existingPetType = petTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet type not found with id: " + id));

        if (request.getName() != null) existingPetType.setName(request.getName());
        if (request.getDescription() != null) existingPetType.setDescription(request.getDescription());
        if (request.getIconUrl() != null) existingPetType.setIconUrl(request.getIconUrl());
        if (request.getIsActive() != null) existingPetType.setIsActive(request.getIsActive());
        if (request.getDisplayOrder() != null) existingPetType.setDisplayOrder(request.getDisplayOrder());

        PetType updatedPetType = petTypeRepository.save(existingPetType);
        return petTypeMapper.toResponse(updatedPetType);
    }

    @Override
    @Transactional(readOnly = true)
    public PetTypeResponse getById(UUID id) {
        PetType petType = petTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet type not found with id: " + id));
        
        return petTypeMapper.toResponse(petType);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PetTypeResponse> getAll() {
        return petTypeRepository.findAll().stream()
                .map(petTypeMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PetTypeResponse> getAllActive() {
        return petTypeRepository.findByIsActiveTrue().stream()
                .map(petTypeMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        if (!petTypeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Pet type not found with id: " + id);
        }
        petTypeRepository.deleteById(id);
    }
}

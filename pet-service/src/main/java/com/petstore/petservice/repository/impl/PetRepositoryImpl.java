package com.petstore.petservice.repository.impl;

import com.petstore.petservice.entity.PetEntity;
import com.petstore.petservice.enums.PetStatus;
import com.petstore.petservice.enums.PetType;
import com.petstore.petservice.mapper.PetMapper;
import com.petstore.petservice.model.Pet;
import com.petstore.petservice.repository.PetRepository;
import com.petstore.petservice.repository.jpa.JpaPetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class PetRepositoryImpl implements PetRepository {
    
    private final JpaPetRepository jpaPetRepository;
    private final PetMapper petMapper;
    
    @Override
    public Pet save(Pet pet) {
        PetEntity entity = petMapper.toEntity(pet);
        PetEntity savedEntity = jpaPetRepository.save(entity);
        return petMapper.toDomain(savedEntity);
    }
    
    @Override
    public Optional<Pet> findById(UUID id) {
        return jpaPetRepository.findById(id).map(petMapper::toDomain);
    }
    
    @Override
    public Page<Pet> findAll(Pageable pageable) {
        return jpaPetRepository.findAll(pageable).map(petMapper::toDomain);
    }
    
    @Override
    public Page<Pet> findByStatus(PetStatus status, Pageable pageable) {
        return jpaPetRepository.findByStatus(status, pageable).map(petMapper::toDomain);
    }
    
    @Override
    public Page<Pet> findByPetType(PetType petType, Pageable pageable) {
        return jpaPetRepository.findByPetType(petType, pageable).map(petMapper::toDomain);
    }
    
    @Override
    public void deleteById(UUID id) {
        jpaPetRepository.deleteById(id);
    }
    
    @Override
    public boolean existsById(UUID id) {
        return jpaPetRepository.existsById(id);
    }
}
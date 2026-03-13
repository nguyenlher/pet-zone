package com.petstore.petservice.repository.impl;

import com.petstore.petservice.entity.PetEntity;
import com.petstore.petservice.mapper.PetMapper;
import com.petstore.petservice.model.Pet;
import com.petstore.petservice.repository.PetRepository;
import com.petstore.petservice.repository.jpa.JpaPetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

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
        Optional<PetEntity> entityOpt = jpaPetRepository.findById(id);
        return entityOpt.map(petMapper::toDomain);
    }
    
    @Override
    public List<Pet> findAll() {
        List<PetEntity> entities = jpaPetRepository.findAll();
        return petMapper.toDomain(entities);
    }
    
    @Override
    public List<Pet> findByStatus(String status) {
        List<PetEntity> entities = jpaPetRepository.findByStatus(status);
        return petMapper.toDomain(entities);
    }
    
    @Override
    public List<Pet> findByPetType(String petType) {
        List<PetEntity> entities = jpaPetRepository.findByPetType(petType);
        return petMapper.toDomain(entities);
    }
    
    @Override
    public List<Pet> findByBreedPrimaryId(UUID breedId) {
        List<PetEntity> entities = jpaPetRepository.findByBreedPrimaryId(breedId);
        return petMapper.toDomain(entities);
    }
    
    @Override
    public List<Pet> findByCity(String city) {
        List<PetEntity> entities = jpaPetRepository.findByCity(city);
        return petMapper.toDomain(entities);
    }
    
    @Override
    public void deleteById(UUID id) {
        jpaPetRepository.deleteById(id);
    }
    
    @Override
    public boolean existsById(UUID id) {
        return jpaPetRepository.existsById(id);
    }
    
    @Override
    public long count() {
        return jpaPetRepository.count();
    }
}
package com.petstore.petservice.repository.impl;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import com.petstore.petservice.mapper.PetTypeMapper;
import com.petstore.petservice.model.PetType;
import com.petstore.petservice.repository.PetTypeRepository;
import com.petstore.petservice.repository.jpa.JpaPetTypeRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class PetTypeRepositoryImpl implements PetTypeRepository {

    private final JpaPetTypeRepository jpaPetTypeRepository;
    private final PetTypeMapper petTypeMapper;

    @Override
    public PetType save(PetType petType) {
        var entity = petTypeMapper.toEntity(petType);
        var savedEntity = jpaPetTypeRepository.save(entity);
        return petTypeMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<PetType> findById(UUID id) {
        return jpaPetTypeRepository.findById(id)
                .map(petTypeMapper::toDomain);
    }

    @Override
    public List<PetType> findAll() {
        return jpaPetTypeRepository.findAll().stream()
                .map(petTypeMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<PetType> findByIsActiveTrue() {
        return jpaPetTypeRepository.findByIsActiveTrue().stream()
                .map(petTypeMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsById(UUID id) {
        return jpaPetTypeRepository.existsById(id);
    }

    @Override
    public void deleteById(UUID id) {
        jpaPetTypeRepository.deleteById(id);
    }
}

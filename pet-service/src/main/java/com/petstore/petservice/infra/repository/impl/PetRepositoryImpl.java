package com.petstore.petservice.infra.repository.impl;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.petstore.petservice.domain.model.Pet;
import com.petstore.petservice.domain.model.enums.PetStatus;
import com.petstore.petservice.domain.repository.PetRepository;
import com.petstore.petservice.infra.mapper.PetMapper;
import com.petstore.petservice.infra.repository.jpa.JpaPetRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class PetRepositoryImpl implements PetRepository {

    private final JpaPetRepository jpaPetRepository;
    private final PetMapper petMapper;

    @Override
    public Pet save(Pet pet) {
        var entity = petMapper.toEntity(pet);
        var savedEntity = jpaPetRepository.save(entity);
        return petMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<Pet> findById(UUID id) {
        return jpaPetRepository.findByIdWithImagesAndModel(id)
                .map(petMapper::toDomain);
    }

    @Override
    public Page<Pet> findByStatus(PetStatus status, Pageable pageable) {
        return jpaPetRepository.findByStatus(status, pageable)
                .map(petMapper::toDomain);
    }

    @Override
    public boolean existsById(UUID id) {
        return jpaPetRepository.existsById(id);
    }

    @Override
    public void deleteById(UUID id) {
        jpaPetRepository.deleteById(id);
    }

    @Override
    public void incrementViewCount(UUID id) {
        jpaPetRepository.incrementViewCount(id);
    }
}

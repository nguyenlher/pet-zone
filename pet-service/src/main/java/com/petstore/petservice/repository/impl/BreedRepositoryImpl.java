package com.petstore.petservice.repository.impl;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Repository;

import com.petstore.petservice.mapper.BreedMapper;
import com.petstore.petservice.model.Breed;
import com.petstore.petservice.repository.BreedRepository;
import com.petstore.petservice.repository.jpa.JpaBreedRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class BreedRepositoryImpl implements BreedRepository {

    private final JpaBreedRepository jpaBreedRepository;
    private final BreedMapper breedMapper;

    @Override
    public Optional<Breed> findById(UUID id) {
        return jpaBreedRepository.findById(id)
                .map(breedMapper::toDomain);
    }

    @Override
    public boolean existsById(UUID id) {
        return jpaBreedRepository.existsById(id);
    }
}

package com.petstore.petservice.infra.repository.impl;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Repository;

import com.petstore.petservice.infra.mapper.BreedMapper;
import com.petstore.petservice.domain.model.Breed;
import com.petstore.petservice.domain.repository.BreedRepository;
import com.petstore.petservice.infra.repository.jpa.JpaBreedRepository;

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

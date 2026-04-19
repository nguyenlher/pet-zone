package com.petstore.petservice.domain.repository;

import java.util.Optional;
import java.util.UUID;

import com.petstore.petservice.domain.model.Breed;

public interface BreedRepository {
    Optional<Breed> findById(UUID id);
    boolean existsById(UUID id);
}

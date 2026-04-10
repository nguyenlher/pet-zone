package com.petstore.petservice.repository;

import java.util.Optional;
import java.util.UUID;

import com.petstore.petservice.model.Breed;

public interface BreedRepository {
    Optional<Breed> findById(UUID id);
    boolean existsById(UUID id);
}

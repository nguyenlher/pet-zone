package com.petstore.petservice.domain.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.petstore.petservice.domain.model.Breed;

public interface BreedRepository {
    Optional<Breed> findById(UUID id);
    boolean existsById(UUID id);
    List<Breed> findAllByIdIn(List<UUID> ids);
}

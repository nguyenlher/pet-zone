package com.petstore.petservice.domain.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.petstore.petservice.domain.model.PetType;

public interface PetTypeRepository {
    PetType save(PetType petType);
    Optional<PetType> findById(UUID id);
    List<PetType> findAll();
    List<PetType> findByIsActiveTrue();
    boolean existsById(UUID id);
    void deleteById(UUID id);
}

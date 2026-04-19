package com.petstore.petservice.domain.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.petstore.petservice.domain.model.Pet;
import com.petstore.petservice.domain.model.enums.PetStatus;

public interface PetRepository {
    Pet save(Pet pet);
    Optional<Pet> findById(UUID id);
    Page<Pet> findByStatus(PetStatus status, Pageable pageable);
    boolean existsById(UUID id);
    void deleteById(UUID id);
    void incrementViewCount(UUID id);
}

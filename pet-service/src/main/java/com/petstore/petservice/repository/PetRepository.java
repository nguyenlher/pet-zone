package com.petstore.petservice.repository;

import com.petstore.petservice.enums.PetStatus;
import com.petstore.petservice.enums.PetType;
import com.petstore.petservice.model.Pet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.UUID;

public interface PetRepository {
    Pet save(Pet pet);
    Optional<Pet> findById(UUID id);
    Page<Pet> findAll(Pageable pageable);
    Page<Pet> findByStatus(PetStatus status, Pageable pageable);
    Page<Pet> findByPetType(PetType petType, Pageable pageable);
    void deleteById(UUID id);
    boolean existsById(UUID id);
}
package com.petstore.petservice.domain.repository;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.petstore.petservice.domain.model.Pet;
import com.petstore.petservice.domain.model.enums.PetStatus;

public interface PetRepository {
    Pet save(Pet pet);
    Optional<Pet> findById(UUID id);
    Page<Pet> findAll(Pageable pageable);
    Page<Pet> findByStatus(PetStatus status, Pageable pageable);
    Page<Pet> findWithFilters(BigDecimal minPrice, BigDecimal maxPrice, PetStatus status, String keyword, Pageable pageable);
    boolean existsById(UUID id);
    void deleteById(UUID id);
    void incrementViewCount(UUID id);
}

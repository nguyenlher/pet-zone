package com.petstore.petservice.repository;

import com.petstore.petservice.model.Pet;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PetRepository {
    Pet save(Pet pet);
    Optional<Pet> findById(UUID id);
    List<Pet> findAll();
    List<Pet> findByStatus(String status);
    List<Pet> findByPetType(String petType);
    List<Pet> findByBreedPrimaryId(UUID breedId);
    List<Pet> findByCity(String city);
    void deleteById(UUID id);
    boolean existsById(UUID id);
    long count();
}
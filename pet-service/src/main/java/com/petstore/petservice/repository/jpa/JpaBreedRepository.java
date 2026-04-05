package com.petstore.petservice.repository.jpa;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.petstore.petservice.entity.BreedEntity;
import com.petstore.petservice.model.enums.PetType;

public interface JpaBreedRepository extends JpaRepository<BreedEntity, UUID> {
    List<BreedEntity> findByPetTypeAndIsActiveTrue(PetType petType);
}
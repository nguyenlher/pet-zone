package com.petstore.petservice.repository.jpa;

import com.petstore.petservice.entity.BreedEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface JpaBreedRepository extends JpaRepository<BreedEntity, UUID> {
}
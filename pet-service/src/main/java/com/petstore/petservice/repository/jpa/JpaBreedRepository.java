package com.petstore.petservice.repository.jpa;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.petstore.petservice.entity.BreedEntity;

@Repository
public interface JpaBreedRepository extends JpaRepository<BreedEntity, UUID> {
}

package com.petstore.petservice.infra.repository.jpa;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.petstore.petservice.infra.entity.PetTypeEntity;

@Repository
public interface JpaPetTypeRepository extends JpaRepository<PetTypeEntity, UUID> {
    List<PetTypeEntity> findByIsActiveTrue();
}

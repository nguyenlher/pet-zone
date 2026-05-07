package com.petstore.petservice.infra.repository.jpa;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.petstore.petservice.domain.model.enums.EntityType;
import com.petstore.petservice.infra.entity.PetProductImageEntity;

@Repository
public interface JpaPetProductImageRepository extends JpaRepository<PetProductImageEntity, UUID> {
    List<PetProductImageEntity> findByEntityTypeAndEntityId(EntityType entityType, UUID entityId);
}

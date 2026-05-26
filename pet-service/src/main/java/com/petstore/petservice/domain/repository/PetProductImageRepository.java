package com.petstore.petservice.domain.repository;

import java.util.List;
import java.util.UUID;

import com.petstore.petservice.domain.model.PetProductImage;
import com.petstore.petservice.domain.model.enums.EntityType;

public interface PetProductImageRepository {
    List<PetProductImage> findByEntityTypeAndEntityId(EntityType entityType, UUID entityId);
    PetProductImage save(PetProductImage image);
    void delete(UUID id);
}

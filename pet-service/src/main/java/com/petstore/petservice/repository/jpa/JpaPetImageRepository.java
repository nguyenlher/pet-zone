package com.petstore.petservice.repository.jpa;

import com.petstore.petservice.entity.PetImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface JpaPetImageRepository extends JpaRepository<PetImageEntity, UUID> {
    List<PetImageEntity> findByPetIdOrderBySortOrderAsc(UUID petId);
    void deleteByPetId(UUID petId);
}
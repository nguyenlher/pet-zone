package com.petstore.petservice.repository.jpa;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.petstore.petservice.entity.PetImageEntity;

@Repository
public interface JpaPetImageRepository extends JpaRepository<PetImageEntity, UUID> {
    List<PetImageEntity> findByPetId(UUID petId);
}

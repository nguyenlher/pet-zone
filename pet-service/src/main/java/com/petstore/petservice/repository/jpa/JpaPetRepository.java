package com.petstore.petservice.repository.jpa;

import com.petstore.petservice.entity.PetEntity;
import com.petstore.petservice.enums.PetStatus;
import com.petstore.petservice.enums.PetType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface JpaPetRepository extends JpaRepository<PetEntity, UUID>, JpaSpecificationExecutor<PetEntity> {
    
    Page<PetEntity> findByStatus(PetStatus status, Pageable pageable);
    
    Page<PetEntity> findByPetType(PetType petType, Pageable pageable);
    
    Page<PetEntity> findByBreedId(UUID breedId, Pageable pageable);
    
    @Query("SELECT p FROM PetEntity p WHERE p.status = :status ORDER BY p.createdAt DESC")
    Page<PetEntity> findByStatusOrderByCreatedAtDesc(@Param("status") PetStatus status, Pageable pageable);
    
    @Modifying
    @Query("UPDATE PetEntity p SET p.viewCount = p.viewCount + 1 WHERE p.id = :id")
    void incrementViewCount(@Param("id") UUID id);
}
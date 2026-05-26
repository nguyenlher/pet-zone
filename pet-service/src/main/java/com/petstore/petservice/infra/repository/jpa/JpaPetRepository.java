package com.petstore.petservice.infra.repository.jpa;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.petstore.petservice.domain.model.enums.PetStatus;
import com.petstore.petservice.infra.entity.PetEntity;

@Repository
public interface JpaPetRepository extends JpaRepository<PetEntity, UUID> {
    
    @Query("SELECT DISTINCT p FROM PetEntity p " +
           "LEFT JOIN FETCH p.images " +
           "LEFT JOIN FETCH p.model3d " +
           "WHERE p.status = :status")
    Page<PetEntity> findByStatusWithImages(@Param("status") PetStatus status, Pageable pageable);
    
    Page<PetEntity> findByStatus(PetStatus status, Pageable pageable);
    
    @Query("SELECT p FROM PetEntity p " +
           "LEFT JOIN FETCH p.images " +
           "LEFT JOIN FETCH p.model3d " +
           "WHERE p.id = :id")
    Optional<PetEntity> findByIdWithImagesAndModel(@Param("id") UUID id);
    
    @Modifying
    @Query("UPDATE PetEntity p SET p.viewCount = p.viewCount + 1 WHERE p.id = :id")
    void incrementViewCount(@Param("id") UUID id);
}

package com.petstore.petservice.infra.repository.jpa;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.petstore.petservice.infra.entity.PetEntity;
import com.petstore.petservice.domain.model.enums.PetStatus;

@Repository
public interface JpaPetRepository extends JpaRepository<PetEntity, UUID> {
    Page<PetEntity> findByStatus(PetStatus status, Pageable pageable);
    
    @Modifying
    @Query("UPDATE PetEntity p SET p.viewCount = p.viewCount + 1 WHERE p.id = :id")
    void incrementViewCount(@Param("id") UUID id);
}

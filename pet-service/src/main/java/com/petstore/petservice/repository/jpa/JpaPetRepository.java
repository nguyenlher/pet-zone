package com.petstore.petservice.repository.jpa;

import com.petstore.petservice.entity.PetEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface JpaPetRepository extends JpaRepository<PetEntity, UUID>, JpaSpecificationExecutor<PetEntity> {
    List<PetEntity> findByStatus(String status);
    List<PetEntity> findByPetType(String petType);
    
    // THÊM method này để support Pageable
    Page<PetEntity> findByPetType(String petType, Pageable pageable);
    
    List<PetEntity> findByBreedPrimaryId(UUID breedId);
    List<PetEntity> findByCity(String city);
    
    @Query("SELECT p FROM PetEntity p WHERE p.isFeatured = true AND (p.featuredUntil IS NULL OR p.featuredUntil >= CURRENT_DATE)")
    List<PetEntity> findFeaturedPets();
    
    // THÊM method này nếu muốn featured pets có phân trang
    @Query("SELECT p FROM PetEntity p WHERE p.isFeatured = true AND (p.featuredUntil IS NULL OR p.featuredUntil >= CURRENT_DATE)")
    Page<PetEntity> findFeaturedPets(Pageable pageable);
    
    @Query("SELECT p FROM PetEntity p WHERE p.status = 'available' ORDER BY p.createdAt DESC")
    Page<PetEntity> findLatestAvailable(Pageable pageable);
    
    @Modifying
    @Query("UPDATE PetEntity p SET p.viewCount = p.viewCount + 1 WHERE p.id = :id")
    void incrementViewCount(@Param("id") UUID id);
}
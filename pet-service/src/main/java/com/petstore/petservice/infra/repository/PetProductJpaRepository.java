package com.petstore.petservice.infra.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.petstore.petservice.domain.model.enums.ProductCategory;
import com.petstore.petservice.domain.model.enums.ProductStatus;
import com.petstore.petservice.infra.entity.PetProductEntity;

@Repository
public interface PetProductJpaRepository extends JpaRepository<PetProductEntity, UUID> {
    
    Page<PetProductEntity> findByStatus(ProductStatus status, Pageable pageable);
    
    Page<PetProductEntity> findByCategory(ProductCategory category, Pageable pageable);
    
    Page<PetProductEntity> findByCategoryAndStatus(ProductCategory category, ProductStatus status, Pageable pageable);
    
    Page<PetProductEntity> findByPetTypeId(UUID petTypeId, Pageable pageable);
    
    Page<PetProductEntity> findByPetTypeIdAndCategory(UUID petTypeId, ProductCategory category, Pageable pageable);
    
    @Query("SELECT p FROM PetProductEntity p WHERE p.name LIKE %:keyword% OR p.brand LIKE %:keyword%")
    Page<PetProductEntity> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT p FROM PetProductEntity p WHERE p.status = :status ORDER BY p.soldCount DESC")
    List<PetProductEntity> findTopSellingProducts(@Param("status") ProductStatus status, Pageable pageable);
    
    @Query("SELECT p FROM PetProductEntity p WHERE p.status = :status ORDER BY p.avgRating DESC, p.totalReviews DESC")
    List<PetProductEntity> findTopRatedProducts(@Param("status") ProductStatus status, Pageable pageable);
}

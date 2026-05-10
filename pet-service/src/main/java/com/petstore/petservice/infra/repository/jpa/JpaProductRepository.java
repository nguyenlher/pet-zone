package com.petstore.petservice.infra.repository.jpa;

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
import com.petstore.petservice.infra.entity.ProductEntity;

@Repository
public interface JpaProductRepository extends JpaRepository<ProductEntity, UUID> {
    
    Page<ProductEntity> findByStatus(ProductStatus status, Pageable pageable);
    
    Page<ProductEntity> findByCategory(ProductCategory category, Pageable pageable);
    
    Page<ProductEntity> findByCategoryAndStatus(ProductCategory category, ProductStatus status, Pageable pageable);
    
    Page<ProductEntity> findByPetTypeId(UUID petTypeId, Pageable pageable);
    
    Page<ProductEntity> findByPetTypeIdAndCategory(UUID petTypeId, ProductCategory category, Pageable pageable);
    
    @Query("SELECT p FROM ProductEntity p WHERE p.name LIKE %:keyword% OR p.brand LIKE %:keyword%")
    Page<ProductEntity> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT p FROM ProductEntity p WHERE p.status = :status ORDER BY p.soldCount DESC")
    List<ProductEntity> findTopSellingProducts(@Param("status") ProductStatus status, Pageable pageable);
    
    @Query("SELECT p FROM ProductEntity p WHERE p.status = :status ORDER BY p.avgRating DESC, p.totalReviews DESC")
    List<ProductEntity> findTopRatedProducts(@Param("status") ProductStatus status, Pageable pageable);
}

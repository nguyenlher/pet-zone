package com.petstore.petservice.infra.repository.jpa;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
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
    
    @Query("SELECT p FROM ProductEntity p WHERE " +
           "(:category IS NULL OR p.category = :category) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:status IS NULL OR p.status = :status) AND " +
           "(:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', CAST(:keyword AS String), '%')) OR LOWER(p.brand) LIKE LOWER(CONCAT('%', CAST(:keyword AS String), '%')))")
    Page<ProductEntity> findWithFilters(
            @Param("category") ProductCategory category,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("status") ProductStatus status,
            @Param("keyword") String keyword,
            Pageable pageable);

    
    @Query("SELECT p FROM ProductEntity p WHERE p.status = :status ORDER BY p.soldCount DESC")
    List<ProductEntity> findTopSellingProducts(@Param("status") ProductStatus status, Pageable pageable);
    
    @Query("SELECT p FROM ProductEntity p WHERE p.status = :status ORDER BY p.avgRating DESC, p.totalReviews DESC")
    List<ProductEntity> findTopRatedProducts(@Param("status") ProductStatus status, Pageable pageable);
    
    /**
     * Atomic operation: Decrement stock and increment sold count
     * Only succeeds if stock >= quantity and product is AVAILABLE
     * @return number of affected rows (0 if stock insufficient or product not found)
     */
    @Modifying
    @Query("UPDATE ProductEntity p SET " +
           "p.stockQuantity = p.stockQuantity - :quantity, " +
           "p.soldCount = p.soldCount + :quantity, " +
           "p.updatedAt = CURRENT_TIMESTAMP " +
           "WHERE p.id = :id " +
           "AND p.stockQuantity >= :quantity " +
           "AND p.status = 'AVAILABLE'")
    int decrementStockAtomic(
        @Param("id") UUID id, 
        @Param("quantity") Integer quantity
    );
    
    /**
     * Atomic operation: Restore stock (for compensation/rollback)
     * @return number of affected rows
     */
    @Modifying
    @Query("UPDATE ProductEntity p SET " +
           "p.stockQuantity = p.stockQuantity + :quantity, " +
           "p.soldCount = CASE WHEN p.soldCount >= :quantity THEN p.soldCount - :quantity ELSE 0 END, " +
           "p.updatedAt = CURRENT_TIMESTAMP, " +
           "p.status = CASE WHEN p.stockQuantity + :quantity > 0 THEN 'AVAILABLE' ELSE p.status END " +
           "WHERE p.id = :id")
    int restoreStockAtomic(
        @Param("id") UUID id, 
        @Param("quantity") Integer quantity
    );
}

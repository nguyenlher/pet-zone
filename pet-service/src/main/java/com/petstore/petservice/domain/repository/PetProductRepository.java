package com.petstore.petservice.domain.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.petstore.petservice.domain.model.PetProduct;
import com.petstore.petservice.domain.model.enums.ProductCategory;
import com.petstore.petservice.domain.model.enums.ProductStatus;

public interface PetProductRepository {
    
    PetProduct save(PetProduct petProduct);
    
    Optional<PetProduct> findById(UUID id);
    
    Page<PetProduct> findAll(Pageable pageable);
    
    Page<PetProduct> findByStatus(ProductStatus status, Pageable pageable);
    
    Page<PetProduct> findByCategory(ProductCategory category, Pageable pageable);
    
    Page<PetProduct> findByCategoryAndStatus(ProductCategory category, ProductStatus status, Pageable pageable);
    
    Page<PetProduct> findByPetTypeId(UUID petTypeId, Pageable pageable);
    
    Page<PetProduct> searchByKeyword(String keyword, Pageable pageable);
    
    List<PetProduct> findTopSellingProducts(int limit);
    
    List<PetProduct> findTopRatedProducts(int limit);
    
    void deleteById(UUID id);
    
    boolean existsById(UUID id);
}

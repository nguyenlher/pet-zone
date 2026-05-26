package com.petstore.petservice.domain.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.petstore.petservice.domain.model.Product;
import com.petstore.petservice.domain.model.enums.ProductCategory;
import com.petstore.petservice.domain.model.enums.ProductStatus;

public interface ProductRepository {
    
    Product save(Product petProduct);
    
    Optional<Product> findById(UUID id);
    
    Page<Product> findAll(Pageable pageable);
    
    Page<Product> findByStatus(ProductStatus status, Pageable pageable);
    
    Page<Product> findByCategory(ProductCategory category, Pageable pageable);
    
    Page<Product> findByCategoryAndStatus(ProductCategory category, ProductStatus status, Pageable pageable);
    
    Page<Product> findByPetTypeId(UUID petTypeId, Pageable pageable);
    
    Page<Product> searchByKeyword(String keyword, Pageable pageable);
    
    List<Product> findTopSellingProducts(int limit);
    
    List<Product> findTopRatedProducts(int limit);
    
    void deleteById(UUID id);
    
    boolean existsById(UUID id);
}

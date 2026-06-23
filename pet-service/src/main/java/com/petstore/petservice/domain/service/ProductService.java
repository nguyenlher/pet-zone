package com.petstore.petservice.domain.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.petstore.petservice.domain.model.Product;
import com.petstore.petservice.domain.model.enums.ProductCategory;
import com.petstore.petservice.domain.model.enums.ProductStatus;

public interface ProductService {
    
    Product createProduct(Product petProduct);
    
    Product updateProduct(UUID id, Product petProduct);
    
    Product getProductById(UUID id);
    
    Product incrementViewCount(UUID id);
    
    Page<Product> getAllProducts(Pageable pageable);
    
    Page<Product> getProductsByStatus(ProductStatus status, Pageable pageable);
    
    Page<Product> getProductsByCategory(ProductCategory category, Pageable pageable);
    
    Page<Product> getProductsByCategoryAndStatus(ProductCategory category, ProductStatus status, Pageable pageable);
    
    Page<Product> getProductsByPetType(UUID petTypeId, Pageable pageable);
    
    Page<Product> searchProducts(String keyword, Pageable pageable);
    
    Page<Product> getProductsWithFilters(ProductCategory category, java.math.BigDecimal minPrice, java.math.BigDecimal maxPrice, ProductStatus status, String keyword, Pageable pageable);
    
    List<Product> getTopSellingProducts(int limit);
    
    List<Product> getTopRatedProducts(int limit);
    
    void deleteProduct(UUID id);
    
    Product updateStock(UUID id, Integer quantity);
    
    Product incrementSoldCount(UUID id, Integer quantity);
}

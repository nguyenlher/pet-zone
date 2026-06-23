package com.petstore.petservice.domain.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.petstore.petservice.domain.model.Product;
import com.petstore.petservice.domain.model.enums.ProductCategory;
import com.petstore.petservice.domain.model.enums.ProductStatus;
import com.petstore.petservice.domain.repository.ProductRepository;
import com.petstore.petservice.domain.service.ProductService;
import com.petstore.petservice.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    
    private final ProductRepository petProductRepository;
    
    @Override
    @Transactional
    public Product createProduct(Product petProduct) {
        return petProductRepository.save(petProduct);
    }
    
    @Override
    @Transactional
    public Product updateProduct(UUID id, Product petProduct) {
        if (!petProductRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        petProduct.setId(id);
        return petProductRepository.save(petProduct);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Product getProductById(UUID id) {
        return petProductRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }
    
    @Override
    @Transactional
    public Product incrementViewCount(UUID id) {
        Product product = getProductById(id);
        product.setViewCount(product.getViewCount() + 1);
        return petProductRepository.save(product);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<Product> getAllProducts(Pageable pageable) {
        return petProductRepository.findAll(pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<Product> getProductsByStatus(ProductStatus status, Pageable pageable) {
        return petProductRepository.findByStatus(status, pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<Product> getProductsByCategory(ProductCategory category, Pageable pageable) {
        return petProductRepository.findByCategory(category, pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<Product> getProductsByCategoryAndStatus(ProductCategory category, ProductStatus status, Pageable pageable) {
        return petProductRepository.findByCategoryAndStatus(category, status, pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<Product> getProductsByPetType(UUID petTypeId, Pageable pageable) {
        return petProductRepository.findByPetTypeId(petTypeId, pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<Product> searchProducts(String keyword, Pageable pageable) {
        return petProductRepository.searchByKeyword(keyword, pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<Product> getProductsWithFilters(ProductCategory category, java.math.BigDecimal minPrice, java.math.BigDecimal maxPrice, ProductStatus status, String keyword, Pageable pageable) {
        return petProductRepository.findWithFilters(category, minPrice, maxPrice, status, keyword, pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Product> getTopSellingProducts(int limit) {
        return petProductRepository.findTopSellingProducts(limit);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Product> getTopRatedProducts(int limit) {
        return petProductRepository.findTopRatedProducts(limit);
    }
    
    @Override
    @Transactional
    public void deleteProduct(UUID id) {
        if (!petProductRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        petProductRepository.deleteById(id);
    }
    
    @Override
    @Transactional
    public Product updateStock(UUID id, Integer quantity) {
        Product product = getProductById(id);
        product.setStockQuantity(quantity);
        
        // Auto update status based on stock
        if (quantity <= 0) {
            product.setStatus(ProductStatus.OUT_OF_STOCK);
        } else if (product.getStatus() == ProductStatus.OUT_OF_STOCK) {
            product.setStatus(ProductStatus.AVAILABLE);
        }
        
        return petProductRepository.save(product);
    }
    
    @Override
    @Transactional
    public Product incrementSoldCount(UUID id, Integer quantity) {
        Product product = getProductById(id);
        product.setSoldCount(product.getSoldCount() + quantity);
        product.setStockQuantity(product.getStockQuantity() - quantity);
        
        if (product.getStockQuantity() <= 0) {
            product.setStatus(ProductStatus.OUT_OF_STOCK);
        }
        
        return petProductRepository.save(product);
    }
}

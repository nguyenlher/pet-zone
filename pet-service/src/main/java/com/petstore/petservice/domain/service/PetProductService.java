package com.petstore.petservice.domain.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.petstore.petservice.domain.model.PetProduct;
import com.petstore.petservice.domain.model.enums.ProductCategory;
import com.petstore.petservice.domain.model.enums.ProductStatus;
import com.petstore.petservice.domain.repository.PetProductRepository;
import com.petstore.petservice.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PetProductService {
    
    private final PetProductRepository petProductRepository;
    
    @Transactional
    public PetProduct createProduct(PetProduct petProduct) {
        return petProductRepository.save(petProduct);
    }
    
    @Transactional
    public PetProduct updateProduct(UUID id, PetProduct petProduct) {
        if (!petProductRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        petProduct.setId(id);
        return petProductRepository.save(petProduct);
    }
    
    @Transactional(readOnly = true)
    public PetProduct getProductById(UUID id) {
        return petProductRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }
    
    @Transactional
    public PetProduct incrementViewCount(UUID id) {
        PetProduct product = getProductById(id);
        product.setViewCount(product.getViewCount() + 1);
        return petProductRepository.save(product);
    }
    
    @Transactional(readOnly = true)
    public Page<PetProduct> getAllProducts(Pageable pageable) {
        return petProductRepository.findAll(pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<PetProduct> getProductsByStatus(ProductStatus status, Pageable pageable) {
        return petProductRepository.findByStatus(status, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<PetProduct> getProductsByCategory(ProductCategory category, Pageable pageable) {
        return petProductRepository.findByCategory(category, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<PetProduct> getProductsByCategoryAndStatus(ProductCategory category, ProductStatus status, Pageable pageable) {
        return petProductRepository.findByCategoryAndStatus(category, status, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<PetProduct> getProductsByPetType(UUID petTypeId, Pageable pageable) {
        return petProductRepository.findByPetTypeId(petTypeId, pageable);
    }
    
    @Transactional(readOnly = true)
    public Page<PetProduct> searchProducts(String keyword, Pageable pageable) {
        return petProductRepository.searchByKeyword(keyword, pageable);
    }
    
    @Transactional(readOnly = true)
    public List<PetProduct> getTopSellingProducts(int limit) {
        return petProductRepository.findTopSellingProducts(limit);
    }
    
    @Transactional(readOnly = true)
    public List<PetProduct> getTopRatedProducts(int limit) {
        return petProductRepository.findTopRatedProducts(limit);
    }
    
    @Transactional
    public void deleteProduct(UUID id) {
        if (!petProductRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        petProductRepository.deleteById(id);
    }
    
    @Transactional
    public PetProduct updateStock(UUID id, Integer quantity) {
        PetProduct product = getProductById(id);
        product.setStockQuantity(quantity);
        
        // Auto update status based on stock
        if (quantity <= 0) {
            product.setStatus(ProductStatus.OUT_OF_STOCK);
        } else if (product.getStatus() == ProductStatus.OUT_OF_STOCK) {
            product.setStatus(ProductStatus.AVAILABLE);
        }
        
        return petProductRepository.save(product);
    }
    
    @Transactional
    public PetProduct incrementSoldCount(UUID id, Integer quantity) {
        PetProduct product = getProductById(id);
        product.setSoldCount(product.getSoldCount() + quantity);
        product.setStockQuantity(product.getStockQuantity() - quantity);
        
        if (product.getStockQuantity() <= 0) {
            product.setStatus(ProductStatus.OUT_OF_STOCK);
        }
        
        return petProductRepository.save(product);
    }
}

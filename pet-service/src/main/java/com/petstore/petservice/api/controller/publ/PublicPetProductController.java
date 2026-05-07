package com.petstore.petservice.api.controller.publ;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.petstore.petservice.api.dto.request.CreatePetProductRequest;
import com.petstore.petservice.api.dto.request.UpdatePetProductRequest;
import com.petstore.petservice.api.dto.response.PetProductResponse;
import com.petstore.petservice.domain.model.PetProduct;
import com.petstore.petservice.domain.model.PetProductImage;
import com.petstore.petservice.domain.model.enums.ProductCategory;
import com.petstore.petservice.domain.model.enums.ProductStatus;
import com.petstore.petservice.domain.service.PetProductService;
import com.petstore.petservice.infra.mapper.PetProductMapper;
import com.petstore.petservice.utils.PetApiPath;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(PetApiPath.PET_PRODUCT_PUBLIC_BASE)
@RequiredArgsConstructor
public class PublicPetProductController {
    
    private final PetProductService petProductService;
    private final PetProductMapper petProductMapper;
    
    @GetMapping
    public ResponseEntity<Page<PetProductResponse>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {
        
        Sort sort = sortDirection.equalsIgnoreCase("ASC") 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<PetProduct> products = petProductService.getAllProducts(pageable);
        Page<PetProductResponse> response = products.map(petProductMapper::toResponse);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping(PetApiPath.PET_PRODUCT_PUBLIC_BY_ID)
    public ResponseEntity<PetProductResponse> getProductById(@PathVariable UUID productId) {
        PetProduct product = petProductService.getProductById(productId);
        return ResponseEntity.ok(petProductMapper.toResponse(product));
    }
    
    @PostMapping(PetApiPath.PET_PRODUCT_PUBLIC_INCREMENT_VIEW)
    public ResponseEntity<Void> incrementViewCount(@PathVariable UUID productId) {
        petProductService.incrementViewCount(productId);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping(PetApiPath.PET_PRODUCT_PUBLIC_BY_CATEGORY)
    public ResponseEntity<Page<PetProductResponse>> getProductsByCategory(
            @PathVariable ProductCategory category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<PetProduct> products = petProductService.getProductsByCategory(category, pageable);
        Page<PetProductResponse> response = products.map(petProductMapper::toResponse);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping(PetApiPath.PET_PRODUCT_PUBLIC_BY_PET_TYPE)
    public ResponseEntity<Page<PetProductResponse>> getProductsByPetType(
            @PathVariable UUID petTypeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<PetProduct> products = petProductService.getProductsByPetType(petTypeId, pageable);
        Page<PetProductResponse> response = products.map(petProductMapper::toResponse);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping(PetApiPath.PET_PRODUCT_PUBLIC_SEARCH)
    public ResponseEntity<Page<PetProductResponse>> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<PetProduct> products = petProductService.searchProducts(keyword, pageable);
        Page<PetProductResponse> response = products.map(petProductMapper::toResponse);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping(PetApiPath.PET_PRODUCT_PUBLIC_TOP_SELLING)
    public ResponseEntity<List<PetProductResponse>> getTopSellingProducts(
            @RequestParam(defaultValue = "10") int limit) {
        
        List<PetProduct> products = petProductService.getTopSellingProducts(limit);
        List<PetProductResponse> response = petProductMapper.toResponseList(products);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping(PetApiPath.PET_PRODUCT_PUBLIC_TOP_RATED)
    public ResponseEntity<List<PetProductResponse>> getTopRatedProducts(
            @RequestParam(defaultValue = "10") int limit) {
        
        List<PetProduct> products = petProductService.getTopRatedProducts(limit);
        List<PetProductResponse> response = petProductMapper.toResponseList(products);
        
        return ResponseEntity.ok(response);
    }
    
    // ==================== ADMIN ENDPOINTS (Authorization via Gateway) ====================
    
    @PostMapping
    public ResponseEntity<PetProductResponse> createProduct(
            @Valid @RequestBody CreatePetProductRequest request) {
        
        PetProduct product = petProductMapper.toDomain(request);
        
        // Set default values
        product.setStockQuantity(request.getStockQuantity() != null ? request.getStockQuantity() : 0);
        product.setStatus(product.getStockQuantity() > 0 ? ProductStatus.AVAILABLE : ProductStatus.OUT_OF_STOCK);
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        
        // Add images if provided
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            List<PetProductImage> images = request.getImageUrls().stream()
                    .map(url -> PetProductImage.builder()
                            .imageUrl(url)
                            .isThumbnail(request.getImageUrls().indexOf(url) == 0)
                            .displayOrder(request.getImageUrls().indexOf(url))
                            .createdAt(LocalDateTime.now())
                            .build())
                    .collect(Collectors.toList());
            product.setImages(images);
        }
        
        PetProduct savedProduct = petProductService.createProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(petProductMapper.toResponse(savedProduct));
    }
    
    @PutMapping(PetApiPath.PET_PRODUCT_PUBLIC_BY_ID)
    public ResponseEntity<PetProductResponse> updateProduct(
            @PathVariable UUID productId,
            @Valid @RequestBody UpdatePetProductRequest request) {
        
        PetProduct existingProduct = petProductService.getProductById(productId);
        
        // Use mapper to update only non-null fields
        petProductMapper.updateDomain(existingProduct, request);
        
        // Update images if provided
        if (request.getImageUrls() != null) {
            List<PetProductImage> images = request.getImageUrls().stream()
                    .map(url -> PetProductImage.builder()
                            .imageUrl(url)
                            .isThumbnail(request.getImageUrls().indexOf(url) == 0)
                            .displayOrder(request.getImageUrls().indexOf(url))
                            .createdAt(LocalDateTime.now())
                            .build())
                    .collect(Collectors.toList());
            existingProduct.setImages(images);
        }
        
        PetProduct updatedProduct = petProductService.updateProduct(productId, existingProduct);
        return ResponseEntity.ok(petProductMapper.toResponse(updatedProduct));
    }
    
    @DeleteMapping(PetApiPath.PET_PRODUCT_PUBLIC_BY_ID)
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID productId) {
        petProductService.deleteProduct(productId);
        return ResponseEntity.noContent().build();
    }
}

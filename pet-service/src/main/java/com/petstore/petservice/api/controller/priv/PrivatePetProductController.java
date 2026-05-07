package com.petstore.petservice.api.controller.priv;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.petstore.petservice.api.dto.response.PetProductResponse;
import com.petstore.petservice.domain.model.PetProduct;
import com.petstore.petservice.domain.model.enums.ProductStatus;
import com.petstore.petservice.domain.service.PetProductService;
import com.petstore.petservice.infra.mapper.PetProductMapper;
import com.petstore.petservice.utils.PetApiPath;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(PetApiPath.PET_PRODUCT_PRIVATE_BASE)
@RequiredArgsConstructor
public class PrivatePetProductController {
    
    private final PetProductService petProductService;
    private final PetProductMapper petProductMapper;
    
    @GetMapping(PetApiPath.PET_PRODUCT_PRIVATE_BY_ID)
    public ResponseEntity<PetProductResponse> getProductById(@PathVariable UUID productId) {
        PetProduct product = petProductService.getProductById(productId);
        return ResponseEntity.ok(petProductMapper.toResponse(product));
    }
    
    @GetMapping(PetApiPath.PET_PRODUCT_PRIVATE_CHECK_STOCK)
    public ResponseEntity<Boolean> checkStock(
            @PathVariable UUID productId,
            @RequestParam Integer quantity) {
        
        PetProduct product = petProductService.getProductById(productId);
        boolean hasStock = product.getStockQuantity() >= quantity 
                && product.getStatus() == ProductStatus.AVAILABLE;
        
        return ResponseEntity.ok(hasStock);
    }
    
    @PutMapping(PetApiPath.PET_PRODUCT_PRIVATE_UPDATE_STOCK)
    public ResponseEntity<PetProductResponse> updateStock(
            @PathVariable UUID productId,
            @RequestParam Integer quantity) {
        
        PetProduct product = petProductService.updateStock(productId, quantity);
        return ResponseEntity.ok(petProductMapper.toResponse(product));
    }
    
    @PostMapping(PetApiPath.PET_PRODUCT_PRIVATE_INCREMENT_SOLD)
    public ResponseEntity<PetProductResponse> incrementSoldCount(
            @PathVariable UUID productId,
            @RequestParam Integer quantity) {
        
        PetProduct product = petProductService.incrementSoldCount(productId, quantity);
        return ResponseEntity.ok(petProductMapper.toResponse(product));
    }
}

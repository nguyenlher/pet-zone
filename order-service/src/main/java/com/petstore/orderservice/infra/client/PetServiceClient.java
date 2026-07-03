package com.petstore.orderservice.infra.client;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.petstore.orderservice.api.dto.PetDTO;
import com.petstore.orderservice.api.dto.ProductDTO;
import com.petstore.orderservice.api.dto.response.StockReservationResponse;
import com.petstore.orderservice.exception.InsufficientStockException;
import com.petstore.orderservice.exception.ProductNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class PetServiceClient {
    
    @Qualifier("petRestClient")
    private final RestClient petRestClient;
    
    public PetDTO getPetById(UUID petId) {
        log.debug("Fetching pet data for id: {}", petId);
        
        return petRestClient.get()
                .uri("/private/pets/{petId}", petId)
                .retrieve()
                .body(PetDTO.class);
    }
    
    public ProductDTO getProductById(UUID productId) {
        log.debug("Fetching product data for id: {}", productId);
        
        return petRestClient.get()
                .uri("/private/products/{productId}", productId)
                .retrieve()
                .body(ProductDTO.class);
    }
    
    /**
     * Reserve stock for a product
     * @throws InsufficientStockException if stock is not enough
     * @throws ProductNotFoundException if product not found
     */
    public void reserveStock(UUID productId, Integer quantity) {
        log.info("Reserving stock - productId: {}, quantity: {}", productId, quantity);
        
        try {
            StockReservationResponse response = petRestClient.post()
                    .uri("/private/stock/products/{productId}/reserve?quantity={quantity}", 
                         productId, quantity)
                    .retrieve()
                    .onStatus(
                        status -> status.value() == 409, // CONFLICT
                        (req, res) -> {
                            throw new InsufficientStockException("Insufficient stock for product: " + productId);
                        }
                    )
                    .onStatus(
                        status -> status.value() == 404, // NOT FOUND
                        (req, res) -> {
                            throw new ProductNotFoundException("Product not found: " + productId);
                        }
                    )
                    .onStatus(
                        HttpStatusCode::is5xxServerError,
                        (req, res) -> {
                            throw new RuntimeException("Pet service unavailable");
                        }
                    )
                    .body(StockReservationResponse.class);
            
            if (response == null || !response.isSuccess()) {
                throw new RuntimeException("Failed to reserve stock: " + 
                                           (response != null ? response.getMessage() : "Unknown error"));
            }
            
            log.info("Successfully reserved stock - productId: {}, quantity: {}", productId, quantity);
            
        } catch (InsufficientStockException | ProductNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error reserving stock for product: {}", productId, e);
            throw new RuntimeException("Failed to reserve stock", e);
        }
    }
    
    /**
     * Restore stock (compensating transaction)
     */
    public void restoreStock(UUID productId, Integer quantity) {
        log.info("Restoring stock - productId: {}, quantity: {}", productId, quantity);
        
        try {
            petRestClient.post()
                    .uri("/private/stock/products/{productId}/restore?quantity={quantity}", 
                         productId, quantity)
                    .retrieve()
                    .toBodilessEntity();
            
            log.info("Successfully restored stock - productId: {}, quantity: {}", productId, quantity);
            
        } catch (Exception e) {
            log.error("Failed to restore stock for product: {}", productId, e);
        }
    }
}

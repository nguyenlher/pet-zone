package com.petstore.petservice.api.controller.priv;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.petstore.petservice.domain.service.StockReservationService;
import com.petstore.petservice.exception.InsufficientStockException;
import com.petstore.petservice.exception.LockAcquisitionException;
import com.petstore.petservice.exception.ResourceNotFoundException;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/private/stock")
@RequiredArgsConstructor
@Slf4j
public class PrivateStockReservationController {
    
    private final StockReservationService stockReservationService;
    
    /**
     * Reserve stock for a product
     * Used internally by order-service
     */
    @PostMapping("/products/{productId}/reserve")
    public ResponseEntity<ReservationResponse> reserveStock(
            @PathVariable UUID productId,
            @RequestParam Integer quantity) {
        
        log.info("Received stock reservation request - productId: {}, quantity: {}", 
                 productId, quantity);
        
        try {
            stockReservationService.reserveStock(productId, quantity);
            
            return ResponseEntity.ok(
                ReservationResponse.builder()
                    .success(true)
                    .message("Stock reserved successfully")
                    .productId(productId)
                    .quantity(quantity)
                    .build()
            );
            
        } catch (InsufficientStockException e) {
            log.warn("Insufficient stock: {}", e.getMessage());
            return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(ReservationResponse.builder()
                    .success(false)
                    .message(e.getMessage())
                    .productId(productId)
                    .quantity(quantity)
                    .build());
                    
        } catch (LockAcquisitionException e) {
            log.error("Lock acquisition failed: {}", e.getMessage());
            return ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ReservationResponse.builder()
                    .success(false)
                    .message(e.getMessage())
                    .productId(productId)
                    .quantity(quantity)
                    .build());
                    
        } catch (ResourceNotFoundException e) {
            log.error("Product not found: {}", e.getMessage());
            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ReservationResponse.builder()
                    .success(false)
                    .message(e.getMessage())
                    .productId(productId)
                    .quantity(quantity)
                    .build());
        }
    }
    
    /**
     * Restore stock (compensating transaction)
     * Used when order is cancelled or payment fails
     */
    @PostMapping("/products/{productId}/restore")
    public ResponseEntity<ReservationResponse> restoreStock(
            @PathVariable UUID productId,
            @RequestParam Integer quantity) {
        
        log.info("Received stock restoration request - productId: {}, quantity: {}", 
                 productId, quantity);
        
        try {
            stockReservationService.restoreStock(productId, quantity);
            
            return ResponseEntity.ok(
                ReservationResponse.builder()
                    .success(true)
                    .message("Stock restored successfully")
                    .productId(productId)
                    .quantity(quantity)
                    .build()
            );
            
        } catch (Exception e) {
            log.error("Failed to restore stock: {}", e.getMessage(), e);
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ReservationResponse.builder()
                    .success(false)
                    .message("Failed to restore stock: " + e.getMessage())
                    .productId(productId)
                    .quantity(quantity)
                    .build());
        }
    }
    
    /**
     * Response DTO for stock reservation/restoration operations
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReservationResponse {
        private boolean success;
        private String message;
        private UUID productId;
        private Integer quantity;
    }
}

package com.petstore.petservice.domain.service;

import java.util.UUID;

/**
 * Service for managing stock reservation with distributed locking
 */
public interface StockReservationService {
    
    /**
     * Reserve stock for a product using distributed lock
     * @param productId the product ID
     * @param quantity the quantity to reserve
     * @throws com.petstore.petservice.exception.InsufficientStockException if stock is not enough
     * @throws com.petstore.petservice.exception.LockAcquisitionException if cannot acquire lock
     */
    void reserveStock(UUID productId, Integer quantity);
    
    /**
     * Restore stock (compensating transaction)
     * @param productId the product ID
     * @param quantity the quantity to restore
     */
    void restoreStock(UUID productId, Integer quantity);
}

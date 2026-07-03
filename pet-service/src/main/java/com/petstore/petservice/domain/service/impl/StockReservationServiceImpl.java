package com.petstore.petservice.domain.service.impl;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;

import com.petstore.petservice.domain.model.Product;
import com.petstore.petservice.domain.repository.ProductRepository;
import com.petstore.petservice.domain.service.ProductService;
import com.petstore.petservice.domain.service.StockReservationService;
import com.petstore.petservice.exception.InsufficientStockException;
import com.petstore.petservice.exception.LockAcquisitionException;
import com.petstore.petservice.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class StockReservationServiceImpl implements StockReservationService {
    
    private final ProductRepository productRepository;
    private final ProductService productService;
    private final RedissonClient redissonClient;
    private final TransactionTemplate transactionTemplate;
    
    private static final long LOCK_WAIT_TIME = 10L;     // seconds
    private static final long LOCK_LEASE_TIME = 30L;    // seconds
    
    @Override
    public void reserveStock(UUID productId, Integer quantity) {
        String lockKey = "stock:lock:" + productId;
        RLock lock = redissonClient.getLock(lockKey);
        
        log.debug("Attempting to acquire lock for product: {}", productId);
        
        try {
            // Try to acquire lock with timeout
            boolean acquired = lock.tryLock(LOCK_WAIT_TIME, LOCK_LEASE_TIME, TimeUnit.SECONDS);
            
            if (!acquired) {
                log.warn("Failed to acquire lock for product: {} after {} seconds", 
                         productId, LOCK_WAIT_TIME);
                throw new LockAcquisitionException(
                    "Cannot reserve stock - system is busy. Please try again."
                );
            }
            
            log.info("Lock acquired for product: {}", productId);
            
            // Execute atomic stock decrement inside dedicated transaction
            transactionTemplate.executeWithoutResult(status -> {
                int affectedRows = productRepository.decrementStockAtomic(productId, quantity);
                
                if (affectedRows == 0) {
                    // Either product not found, out of stock, or not available
                    Product product = productService.getProductById(productId);
                    
                    if (product.getStockQuantity() < quantity) {
                        log.warn("Insufficient stock for product: {}. Requested: {}, Available: {}",
                                 productId, quantity, product.getStockQuantity());
                        throw new InsufficientStockException(
                            String.format("Not enough stock. Available: %d, Requested: %d",
                                          product.getStockQuantity(), quantity)
                        );
                    }
                    
                    throw new InsufficientStockException("Product is not available for purchase");
                }
            });
            
            log.info("Successfully reserved {} units of product: {}", quantity, productId);
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Thread interrupted while acquiring lock for product: {}", productId, e);
            throw new LockAcquisitionException("Stock reservation interrupted", e);
            
        } catch (InsufficientStockException | ResourceNotFoundException e) {
            // Re-throw business exceptions
            throw e;
            
        } catch (Exception e) {
            log.error("Unexpected error during stock reservation for product: {}", productId, e);
            throw new RuntimeException("Failed to reserve stock", e);
            
        } finally {
            // Always release lock if held by current thread
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
                log.debug("Lock released for product: {}", productId);
            }
        }
    }
    
    @Override
    public void restoreStock(UUID productId, Integer quantity) {
        String lockKey = "stock:lock:" + productId;
        RLock lock = redissonClient.getLock(lockKey);
        
        log.info("Attempting to restore {} units of product: {}", quantity, productId);
        
        try {
            boolean acquired = lock.tryLock(LOCK_WAIT_TIME, LOCK_LEASE_TIME, TimeUnit.SECONDS);
            
            if (!acquired) {
                log.error("Failed to acquire lock for stock restoration: {}", productId);
                throw new LockAcquisitionException("Cannot restore stock - lock acquisition failed");
            }
            
            transactionTemplate.executeWithoutResult(status -> {
                int affectedRows = productRepository.restoreStockAtomic(productId, quantity);
                
                if (affectedRows == 0) {
                    log.warn("No rows affected when restoring stock for product: {}", productId);
                } else {
                    log.info("Successfully restored {} units of product: {}", quantity, productId);
                }
            });
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Thread interrupted during stock restoration for product: {}", productId, e);
            throw new LockAcquisitionException("Stock restoration interrupted", e);
            
        } catch (Exception e) {
            log.error("Unexpected error during stock restoration for product: {}", productId, e);
            throw new RuntimeException("Failed to restore stock", e);
            
        } finally {
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
                log.debug("Lock released after stock restoration: {}", productId);
            }
        }
    }
}

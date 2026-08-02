package com.petstore.petservice.domain.service.impl;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;

import com.petstore.petservice.domain.model.Pet;
import com.petstore.petservice.domain.repository.PetRepository;
import com.petstore.petservice.domain.service.PetReservationService;
import com.petstore.petservice.exception.LockAcquisitionException;
import com.petstore.petservice.exception.PetNotAvailableException;
import com.petstore.petservice.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PetReservationServiceImpl implements PetReservationService {

    private final PetRepository petRepository;
    private final RedissonClient redissonClient;
    private final TransactionTemplate transactionTemplate;

    private static final long LOCK_WAIT_TIME = 10L;
    private static final long LOCK_LEASE_TIME = 30L;

    @Override
    public void reservePet(UUID petId) {
        String lockKey = "pet:lock:" + petId;
        RLock lock = redissonClient.getLock(lockKey);

        log.debug("Attempting to acquire lock for pet: {}", petId);

        try {
            boolean acquired = lock.tryLock(LOCK_WAIT_TIME, LOCK_LEASE_TIME, TimeUnit.SECONDS);

            if (!acquired) {
                log.warn("Failed to acquire lock for pet: {} after {} seconds", petId, LOCK_WAIT_TIME);
                throw new LockAcquisitionException("Cannot reserve pet - system is busy. Please try again.");
            }

            log.info("Lock acquired for pet: {}", petId);

            transactionTemplate.executeWithoutResult(status -> {
                int affectedRows = petRepository.reservePetAtomic(petId);

                if (affectedRows == 0) {
                    Pet pet = petRepository.findById(petId)
                            .orElseThrow(() -> new ResourceNotFoundException("Pet not found with id: " + petId));

                    log.warn("Pet {} is not available for reservation. Current status: {}", petId, pet.getStatus());
                    throw new PetNotAvailableException(
                            "Pet is not available for purchase (current status: " + pet.getStatus() + ")"
                    );
                }
            });

            log.info("Successfully reserved pet: {}", petId);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Thread interrupted while acquiring lock for pet: {}", petId, e);
            throw new LockAcquisitionException("Pet reservation interrupted", e);

        } catch (PetNotAvailableException | ResourceNotFoundException e) {
            throw e;

        } catch (Exception e) {
            log.error("Unexpected error during pet reservation for pet: {}", petId, e);
            throw new RuntimeException("Failed to reserve pet", e);

        } finally {
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
                log.debug("Lock released for pet: {}", petId);
            }
        }
    }

    @Override
    public void restorePet(UUID petId) {
        String lockKey = "pet:lock:" + petId;
        RLock lock = redissonClient.getLock(lockKey);

        log.info("Attempting to restore pet: {}", petId);

        try {
            boolean acquired = lock.tryLock(LOCK_WAIT_TIME, LOCK_LEASE_TIME, TimeUnit.SECONDS);

            if (!acquired) {
                log.error("Failed to acquire lock for pet restoration: {}", petId);
                throw new LockAcquisitionException("Cannot restore pet - lock acquisition failed");
            }

            transactionTemplate.executeWithoutResult(status -> {
                int affectedRows = petRepository.restorePetAtomic(petId);

                if (affectedRows == 0) {
                    log.warn("No rows affected when restoring pet: {} (pet may not be in RESERVED status)", petId);
                } else {
                    log.info("Successfully restored pet: {} to AVAILABLE", petId);
                }
            });

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Thread interrupted during pet restoration for pet: {}", petId, e);
            throw new LockAcquisitionException("Pet restoration interrupted", e);

        } catch (Exception e) {
            log.error("Unexpected error during pet restoration for pet: {}", petId, e);
            throw new RuntimeException("Failed to restore pet", e);

        } finally {
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
                log.debug("Lock released after pet restoration: {}", petId);
            }
        }
    }

    @Override
    public void confirmPetSold(UUID petId) {
        String lockKey = "pet:lock:" + petId;
        RLock lock = redissonClient.getLock(lockKey);

        log.info("Attempting to confirm pet sold: {}", petId);

        try {
            boolean acquired = lock.tryLock(LOCK_WAIT_TIME, LOCK_LEASE_TIME, TimeUnit.SECONDS);

            if (!acquired) {
                log.error("Failed to acquire lock for pet sold confirmation: {}", petId);
                throw new LockAcquisitionException("Cannot confirm pet sold - lock acquisition failed");
            }

            transactionTemplate.executeWithoutResult(status -> {
                int affectedRows = petRepository.confirmPetSoldAtomic(petId);

                if (affectedRows == 0) {
                    log.warn("No rows affected when confirming pet sold for: {}", petId);
                } else {
                    log.info("Successfully confirmed pet: {} as SOLD", petId);
                }
            });

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Thread interrupted during pet sold confirmation for pet: {}", petId, e);
            throw new LockAcquisitionException("Pet sold confirmation interrupted", e);

        } catch (Exception e) {
            log.error("Unexpected error during pet sold confirmation for pet: {}", petId, e);
            throw new RuntimeException("Failed to confirm pet sold", e);

        } finally {
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
                log.debug("Lock released after pet sold confirmation: {}", petId);
            }
        }
    }
}

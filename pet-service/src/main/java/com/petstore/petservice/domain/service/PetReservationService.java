package com.petstore.petservice.domain.service;

import java.util.UUID;

/**
 * Service for managing pet reservation lifecycle with distributed locking.
 */
public interface PetReservationService {

    /**
     * Reserve a pet by acquiring distributed lock and transitioning status from AVAILABLE to RESERVED.
     *
     * @param petId the pet identifier
     * @throws com.petstore.petservice.exception.PetNotAvailableException if pet is not AVAILABLE or not found
     * @throws com.petstore.petservice.exception.LockAcquisitionException if cannot acquire distributed lock
     */
    void reservePet(UUID petId);

    /**
     * Restore pet availability (compensating action) transitioning status from RESERVED to AVAILABLE.
     *
     * @param petId the pet identifier
     */
    void restorePet(UUID petId);

    /**
     * Confirm pet sale transitioning status from RESERVED to SOLD upon successful payment/confirmation.
     *
     * @param petId the pet identifier
     */
    void confirmPetSold(UUID petId);
}

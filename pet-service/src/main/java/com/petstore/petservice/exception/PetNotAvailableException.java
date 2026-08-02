package com.petstore.petservice.exception;

/**
 * Exception thrown when a pet is not available for purchase or reservation.
 */
public class PetNotAvailableException extends RuntimeException {
    public PetNotAvailableException(String message) {
        super(message);
    }
}

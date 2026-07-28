package com.petstore.userservice.exception;

/**
 * Exception thrown when Captcha verification fails or is invalid.
 */
public class CaptchaValidationException extends RuntimeException {

    public CaptchaValidationException(String message) {
        super(message);
    }

    public CaptchaValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}

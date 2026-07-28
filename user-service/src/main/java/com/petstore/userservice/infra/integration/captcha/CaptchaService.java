package com.petstore.userservice.infra.integration.captcha;

/**
 * Service interface for Captcha verification.
 */
public interface CaptchaService {

    /**
     * Verifies captcha token received from client.
     *
     * @param token    captcha token from client
     * @param remoteIp client IP address (optional)
     * @return true if valid or if captcha is disabled, false otherwise
     */
    boolean verify(String token, String remoteIp);
}

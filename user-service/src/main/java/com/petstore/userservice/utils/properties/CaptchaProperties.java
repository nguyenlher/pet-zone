package com.petstore.userservice.utils.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

/**
 * Configuration properties for Captcha verification.
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "app.security.captcha")
public class CaptchaProperties {

    /**
     * Flag to enable/disable captcha verification (useful for dev/test).
     */
    private boolean enabled = true;

    /**
     * Secret key for Cloudflare Turnstile server verification.
     * Default is Cloudflare dummy test secret key (always passes).
     */
    private String secretKey = "1x0000000000000000000000000000000AA";

    /**
     * Endpoint to verify Turnstile token.
     */
    private String verifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
}

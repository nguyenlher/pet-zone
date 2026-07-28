package com.petstore.userservice.unit.infra.integration.captcha;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import com.petstore.userservice.api.dto.response.TurnstileVerifyResponse;
import com.petstore.userservice.infra.integration.captcha.impl.CloudflareTurnstileServiceImpl;
import com.petstore.userservice.utils.properties.CaptchaProperties;

class CloudflareTurnstileServiceImplTest {

    private CaptchaProperties captchaProperties;
    private RestClient restClient;
    private CloudflareTurnstileServiceImpl captchaService;

    @BeforeEach
    void setUp() {
        captchaProperties = new CaptchaProperties();
        captchaProperties.setEnabled(true);
        captchaProperties.setSecretKey("test-secret-key");
        captchaProperties.setVerifyUrl("https://challenges.cloudflare.com/turnstile/v0/siteverify");

        restClient = mock(RestClient.class);
        captchaService = new CloudflareTurnstileServiceImpl(captchaProperties, restClient);
    }

    @Test
    @DisplayName("Should return true when captcha verification is disabled")
    void shouldReturnTrueWhenCaptchaIsDisabled() {
        captchaProperties.setEnabled(false);

        boolean result = captchaService.verify("some-token", "127.0.0.1");

        assertTrue(result);
    }

    @Test
    @DisplayName("Should return false when token is null or empty")
    void shouldReturnFalseWhenTokenIsNullOrEmpty() {
        assertFalse(captchaService.verify(null, "127.0.0.1"));
        assertFalse(captchaService.verify("", "127.0.0.1"));
        assertFalse(captchaService.verify("   ", "127.0.0.1"));
    }

    @Test
    @DisplayName("Should return true when Cloudflare API responds with success=true")
    void shouldReturnTrueWhenVerificationSucceeds() {
        String token = "valid-token";
        String ip = "1.2.3.4";

        TurnstileVerifyResponse mockResponse = TurnstileVerifyResponse.builder()
                .success(true)
                .challengeTs("2026-10-02T16:00:00Z")
                .build();

        setupRestClientMock(mockResponse);

        boolean result = captchaService.verify(token, ip);

        assertTrue(result);
    }

    @Test
    @DisplayName("Should return false when Cloudflare API responds with success=false")
    void shouldReturnFalseWhenVerificationFails() {
        String token = "invalid-token";
        String ip = "1.2.3.4";

        TurnstileVerifyResponse mockResponse = TurnstileVerifyResponse.builder()
                .success(false)
                .build();

        setupRestClientMock(mockResponse);

        boolean result = captchaService.verify(token, ip);

        assertFalse(result);
    }

    @Test
    @DisplayName("Should return false and catch RestClientException gracefully")
    void shouldReturnFalseWhenRestClientThrowsException() {
        String token = "any-token";
        String ip = "1.2.3.4";

        RestClient.RequestBodyUriSpec uriSpec = mock(RestClient.RequestBodyUriSpec.class);
        when(restClient.post()).thenReturn(uriSpec);
        when(uriSpec.uri(any(String.class))).thenReturn(uriSpec);
        when(uriSpec.contentType(any(MediaType.class))).thenReturn(uriSpec);
        when(uriSpec.body(any(Object.class))).thenThrow(new RestClientException("Connection timed out"));

        boolean result = captchaService.verify(token, ip);

        assertFalse(result);
    }

    private void setupRestClientMock(TurnstileVerifyResponse response) {
        RestClient.RequestBodyUriSpec uriSpec = mock(RestClient.RequestBodyUriSpec.class);
        RestClient.ResponseSpec responseSpec = mock(RestClient.ResponseSpec.class);

        when(restClient.post()).thenReturn(uriSpec);
        when(uriSpec.uri(any(String.class))).thenReturn(uriSpec);
        when(uriSpec.contentType(any(MediaType.class))).thenReturn(uriSpec);
        when(uriSpec.body(any(Object.class))).thenReturn(uriSpec);
        when(uriSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.body(TurnstileVerifyResponse.class)).thenReturn(response);
    }
}

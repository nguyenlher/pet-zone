package com.petstore.userservice.unit.api.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.petstore.userservice.api.controller.publ.PublicAuthController;
import com.petstore.userservice.api.dto.request.RegisterRequest;
import com.petstore.userservice.api.dto.response.MessageResponse;
import com.petstore.userservice.exception.CaptchaValidationException;
import com.petstore.userservice.infra.integration.captcha.CaptchaService;
import com.petstore.userservice.infra.integration.keycloak.KeycloakAuthService;
import com.petstore.userservice.infra.mapper.AuthMapper;

import jakarta.servlet.http.HttpServletRequest;

class PublicAuthControllerTest {

    private KeycloakAuthService keycloakAuthService;
    private CaptchaService captchaService;
    private AuthMapper authMapper;
    private PublicAuthController controller;
    private HttpServletRequest httpRequest;

    @BeforeEach
    void setUp() {
        keycloakAuthService = mock(KeycloakAuthService.class);
        captchaService = mock(CaptchaService.class);
        authMapper = mock(AuthMapper.class);
        controller = new PublicAuthController(keycloakAuthService, captchaService, authMapper);
        httpRequest = mock(HttpServletRequest.class);
    }

    @Test
    @DisplayName("Should successfully register when captcha verification passes")
    void shouldRegisterSuccessfullyWhenCaptchaPasses() {
        RegisterRequest request = RegisterRequest.builder()
                .email("test@example.com")
                .password("password123")
                .firstName("John")
                .lastName("Doe")
                .captchaToken("valid-token")
                .build();

        when(httpRequest.getHeader("X-Forwarded-For")).thenReturn("203.0.113.195");
        when(captchaService.verify(eq("valid-token"), eq("203.0.113.195"))).thenReturn(true);

        ResponseEntity<MessageResponse> response = controller.register(request, httpRequest);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        verify(keycloakAuthService).register(request);
    }

    @Test
    @DisplayName("Should throw CaptchaValidationException when captcha verification fails")
    void shouldThrowExceptionWhenCaptchaFails() {
        RegisterRequest request = RegisterRequest.builder()
                .email("bot@spam.com")
                .password("password123")
                .firstName("Bad")
                .lastName("Bot")
                .captchaToken("fake-token")
                .build();

        when(httpRequest.getRemoteAddr()).thenReturn("192.168.1.100");
        when(captchaService.verify(eq("fake-token"), eq("192.168.1.100"))).thenReturn(false);

        CaptchaValidationException ex = assertThrows(CaptchaValidationException.class, () -> {
            controller.register(request, httpRequest);
        });

        assertTrue(ex.getMessage().contains("Captcha"));
        verify(keycloakAuthService, never()).register(any());
    }

    @Test
    @DisplayName("Should successfully login when captcha verification passes")
    void shouldLoginSuccessfullyWhenCaptchaPasses() {
        com.petstore.userservice.api.dto.request.LoginRequest request = 
                com.petstore.userservice.api.dto.request.LoginRequest.builder()
                        .email("admin@petzone.com")
                        .password("admin123")
                        .captchaToken("valid-token")
                        .build();

        when(httpRequest.getRemoteAddr()).thenReturn("127.0.0.1");
        when(captchaService.verify(eq("valid-token"), eq("127.0.0.1"))).thenReturn(true);
        when(keycloakAuthService.login(any())).thenReturn(java.util.Map.of("access_token", "jwt-token"));
        when(authMapper.toAuthResponse(any())).thenReturn(new com.petstore.userservice.api.dto.response.AuthResponse());

        ResponseEntity<com.petstore.userservice.api.dto.response.AuthResponse> response = 
                controller.login(request, httpRequest);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(keycloakAuthService).login(request);
    }

    @Test
    @DisplayName("Should throw CaptchaValidationException on login when captcha fails")
    void shouldThrowExceptionOnLoginWhenCaptchaFails() {
        com.petstore.userservice.api.dto.request.LoginRequest request = 
                com.petstore.userservice.api.dto.request.LoginRequest.builder()
                        .email("admin@petzone.com")
                        .password("admin123")
                        .captchaToken("invalid-token")
                        .build();

        when(httpRequest.getRemoteAddr()).thenReturn("127.0.0.1");
        when(captchaService.verify(eq("invalid-token"), eq("127.0.0.1"))).thenReturn(false);

        assertThrows(CaptchaValidationException.class, () -> {
            controller.login(request, httpRequest);
        });
        verify(keycloakAuthService, never()).login(any());
    }

    @Test
    @DisplayName("Should successfully send forgot password email when captcha passes")
    void shouldForgotPasswordSuccessfullyWhenCaptchaPasses() {
        com.petstore.userservice.api.dto.request.ForgotPasswordRequest request = 
                com.petstore.userservice.api.dto.request.ForgotPasswordRequest.builder()
                        .email("user@petzone.com")
                        .captchaToken("valid-token")
                        .build();

        when(httpRequest.getRemoteAddr()).thenReturn("127.0.0.1");
        when(captchaService.verify(eq("valid-token"), eq("127.0.0.1"))).thenReturn(true);

        ResponseEntity<MessageResponse> response = controller.forgotPassword(request, httpRequest);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(keycloakAuthService).forgotPassword(request);
    }
}

package com.petstore.userservice.api.controller.publ;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.petstore.userservice.api.dto.request.ForgotPasswordRequest;
import com.petstore.userservice.api.dto.request.LoginRequest;
import com.petstore.userservice.api.dto.request.RegisterRequest;
import com.petstore.userservice.api.dto.request.ResetPasswordRequest;
import com.petstore.userservice.api.dto.response.AuthResponse;
import com.petstore.userservice.api.dto.response.MessageResponse;
import com.petstore.userservice.domain.service.KeycloakAuthService;
import com.petstore.userservice.infra.mapper.AuthMapper;
import com.petstore.userservice.utils.UserApiPath;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Public Auth Controller
 * Handles authentication operations (no authentication required)
 * Endpoint: /api/auth/**
 */
@Slf4j
@RestController
@RequestMapping(UserApiPath.AUTH_BASE)
@RequiredArgsConstructor
public class PublicAuthController {

    private final KeycloakAuthService keycloakAuthService;
    private final AuthMapper authMapper;

    @PostMapping(UserApiPath.AUTH_REGISTER)
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Public Auth API: User registration for email: {}", request.getEmail());
        keycloakAuthService.register(request);
        return ResponseEntity.ok(MessageResponse.builder()
                .message("Registration successful")
                .success(true)
                .build());
    }

    @PostMapping(UserApiPath.AUTH_LOGIN)
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Public Auth API: User login for email: {}", request.getEmail());
        Map<String, Object> tokenData = keycloakAuthService.login(request);
        AuthResponse authResponse = authMapper.toAuthResponse(tokenData);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping(UserApiPath.AUTH_LOGOUT)
    public ResponseEntity<MessageResponse> logout(@RequestParam String refreshToken) {
        log.info("Public Auth API: User logout");
        keycloakAuthService.logout(refreshToken);
        return ResponseEntity.ok(MessageResponse.builder()
                .message("Logout successful")
                .success(true)
                .build());
    }

    @PostMapping(UserApiPath.AUTH_FORGOT_PASSWORD)
    public ResponseEntity<MessageResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        log.info("Public Auth API: Forgot password for email: {}", request.getEmail());
        keycloakAuthService.forgotPassword(request);
        return ResponseEntity.ok(MessageResponse.builder()
                .message("Password reset email sent successfully")
                .success(true)
                .build());
    }

    @PostMapping(UserApiPath.AUTH_RESET_PASSWORD)
    public ResponseEntity<MessageResponse> resetPassword(
            @PathVariable String keycloakId,
            @Valid @RequestBody ResetPasswordRequest request) {
        log.info("Public Auth API: Reset password for keycloakId: {}", keycloakId);
        keycloakAuthService.resetPassword(keycloakId, request);
        return ResponseEntity.ok(MessageResponse.builder()
                .message("Password reset successfully")
                .success(true)
                .build());
    }

    @PostMapping(UserApiPath.AUTH_REFRESH)
    public ResponseEntity<AuthResponse> refreshToken(@RequestParam String refreshToken) {
        log.info("Public Auth API: Refresh token");
        Map<String, Object> tokenData = keycloakAuthService.refreshToken(refreshToken);
        AuthResponse authResponse = authMapper.toAuthResponse(tokenData);
        return ResponseEntity.ok(authResponse);
    }
}

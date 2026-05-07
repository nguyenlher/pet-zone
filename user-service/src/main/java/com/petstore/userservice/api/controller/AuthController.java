package com.petstore.userservice.api.controller;

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

@RestController
@RequestMapping(UserApiPath.AUTH_BASE)
@RequiredArgsConstructor
public class AuthController {

    private final KeycloakAuthService keycloakAuthService;
    private final AuthMapper authMapper;

    @PostMapping(UserApiPath.AUTH_REGISTER)
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody RegisterRequest request) {
        keycloakAuthService.register(request);
        return ResponseEntity.ok(MessageResponse.builder()
                .message("Registration successful")
                .success(true)
                .build());
    }

    @PostMapping(UserApiPath.AUTH_LOGIN)
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        Map<String, Object> tokenData = keycloakAuthService.login(request);
        AuthResponse authResponse = authMapper.toAuthResponse(tokenData);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping(UserApiPath.AUTH_LOGOUT)
    public ResponseEntity<MessageResponse> logout(@RequestParam String refreshToken) {
        keycloakAuthService.logout(refreshToken);
        return ResponseEntity.ok(MessageResponse.builder()
                .message("Logout successful")
                .success(true)
                .build());
    }

    @PostMapping(UserApiPath.AUTH_FORGOT_PASSWORD)
    public ResponseEntity<MessageResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
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
        keycloakAuthService.resetPassword(keycloakId, request);
        return ResponseEntity.ok(MessageResponse.builder()
                .message("Password reset successfully")
                .success(true)
                .build());
    }

    @PostMapping(UserApiPath.AUTH_REFRESH)
    public ResponseEntity<AuthResponse> refreshToken(@RequestParam String refreshToken) {
        Map<String, Object> tokenData = keycloakAuthService.refreshToken(refreshToken);
        AuthResponse authResponse = authMapper.toAuthResponse(tokenData);
        return ResponseEntity.ok(authResponse);
    }
}

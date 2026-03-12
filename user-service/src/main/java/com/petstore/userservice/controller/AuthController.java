package com.petstore.userservice.controller;

import com.petstore.userservice.dto.request.ForgotPasswordRequest;
import com.petstore.userservice.dto.request.LoginRequest;
import com.petstore.userservice.dto.request.RegisterRequest;
import com.petstore.userservice.dto.request.ResetPasswordRequest;
import com.petstore.userservice.dto.response.AuthResponse;
import com.petstore.userservice.dto.response.MessageResponse;
import com.petstore.userservice.service.KeycloakAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final KeycloakAuthService keycloakAuthService;

    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody RegisterRequest request) {
        MessageResponse response = keycloakAuthService.register(request);
        return response.isSuccess() 
            ? ResponseEntity.ok(response) 
            : ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = keycloakAuthService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(@RequestParam String refreshToken) {
        MessageResponse response = keycloakAuthService.logout(refreshToken);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        MessageResponse response = keycloakAuthService.forgotPassword(request);
        return response.isSuccess() 
            ? ResponseEntity.ok(response) 
            : ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/reset-password/{userId}")
    public ResponseEntity<MessageResponse> resetPassword(
            @PathVariable String userId,
            @Valid @RequestBody ResetPasswordRequest request) {
        MessageResponse response = keycloakAuthService.resetPassword(userId, request);
        return response.isSuccess() 
            ? ResponseEntity.ok(response) 
            : ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestParam String refreshToken) {
        AuthResponse response = keycloakAuthService.refreshToken(refreshToken);
        return ResponseEntity.ok(response);
    }
}

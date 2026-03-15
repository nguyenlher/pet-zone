package com.petstore.userservice.controller;

import com.petstore.userservice.dto.request.ForgotPasswordRequest;
import com.petstore.userservice.dto.request.LoginRequest;
import com.petstore.userservice.dto.request.RegisterRequest;
import com.petstore.userservice.dto.request.ResetPasswordRequest;
import com.petstore.userservice.dto.response.AuthResponse;
import com.petstore.userservice.dto.response.MessageResponse;
import com.petstore.userservice.service.KeycloakAuthService;
import com.petstore.userservice.utils.UserApiPath;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(UserApiPath.AUTH_BASE)
@RequiredArgsConstructor
public class AuthController {

    private final KeycloakAuthService keycloakAuthService;

    @PostMapping(UserApiPath.AUTH_REGISTER)
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody RegisterRequest request) {
        MessageResponse response = keycloakAuthService.register(request);
        return response.isSuccess() 
            ? ResponseEntity.ok(response) 
            : ResponseEntity.badRequest().body(response);
    }

    @PostMapping(UserApiPath.AUTH_LOGIN)
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = keycloakAuthService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping(UserApiPath.AUTH_LOGOUT)
    public ResponseEntity<MessageResponse> logout(@RequestParam String refreshToken) {
        MessageResponse response = keycloakAuthService.logout(refreshToken);
        return ResponseEntity.ok(response);
    }

    @PostMapping(UserApiPath.AUTH_FORGOT_PASSWORD)
    public ResponseEntity<MessageResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        MessageResponse response = keycloakAuthService.forgotPassword(request);
        return response.isSuccess() 
            ? ResponseEntity.ok(response) 
            : ResponseEntity.badRequest().body(response);
    }

    @PostMapping(UserApiPath.AUTH_RESET_PASSWORD)
    public ResponseEntity<MessageResponse> resetPassword(
            @PathVariable String keycloakId,
            @Valid @RequestBody ResetPasswordRequest request) {
        MessageResponse response = keycloakAuthService.resetPassword(keycloakId, request);
        return response.isSuccess() 
            ? ResponseEntity.ok(response) 
            : ResponseEntity.badRequest().body(response);
    }

    @PostMapping(UserApiPath.AUTH_REFRESH)
    public ResponseEntity<AuthResponse> refreshToken(@RequestParam String refreshToken) {
        AuthResponse response = keycloakAuthService.refreshToken(refreshToken);
        return ResponseEntity.ok(response);
    }
}

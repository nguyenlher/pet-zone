package com.petstore.userservice.domain.service;

import com.petstore.userservice.api.dto.request.ForgotPasswordRequest;
import com.petstore.userservice.api.dto.request.LoginRequest;
import com.petstore.userservice.api.dto.request.RegisterRequest;
import com.petstore.userservice.api.dto.request.ResetPasswordRequest;
import com.petstore.userservice.api.dto.response.AuthResponse;
import com.petstore.userservice.api.dto.response.MessageResponse;

public interface KeycloakAuthService {
    MessageResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    MessageResponse logout(String refreshToken);
    MessageResponse forgotPassword(ForgotPasswordRequest request);
    MessageResponse resetPassword(String keycloakId, ResetPasswordRequest request);
    AuthResponse refreshToken(String refreshToken);
}

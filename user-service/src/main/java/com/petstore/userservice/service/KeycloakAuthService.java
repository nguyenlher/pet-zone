package com.petstore.userservice.service;

import com.petstore.userservice.dto.request.ForgotPasswordRequest;
import com.petstore.userservice.dto.request.LoginRequest;
import com.petstore.userservice.dto.request.RegisterRequest;
import com.petstore.userservice.dto.request.ResetPasswordRequest;
import com.petstore.userservice.dto.response.AuthResponse;
import com.petstore.userservice.dto.response.MessageResponse;

public interface KeycloakAuthService {
    MessageResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    MessageResponse logout(String refreshToken);
    MessageResponse forgotPassword(ForgotPasswordRequest request);
    MessageResponse resetPassword(String userId, ResetPasswordRequest request);
    AuthResponse refreshToken(String refreshToken);
}

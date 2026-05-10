package com.petstore.userservice.domain.service;

import java.util.Map;

import com.petstore.userservice.api.dto.request.ForgotPasswordRequest;
import com.petstore.userservice.api.dto.request.LoginRequest;
import com.petstore.userservice.api.dto.request.RegisterRequest;
import com.petstore.userservice.api.dto.request.ResetPasswordRequest;

public interface KeycloakAuthService {
    void register(RegisterRequest request);
    Map<String, Object> login(LoginRequest request);
    void logout(String refreshToken);
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(String keycloakId, ResetPasswordRequest request);
    Map<String, Object> refreshToken(String refreshToken);
    void updateUserInKeycloak(String keycloakId, String firstName, String lastName);
    void updateUserEnabledStatus(String keycloakId, Boolean isActive);
    void deleteUser(String keycloakId);
}

package com.petstore.userservice.service.impl;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.petstore.userservice.dto.request.ForgotPasswordRequest;
import com.petstore.userservice.dto.request.LoginRequest;
import com.petstore.userservice.dto.request.RegisterRequest;
import com.petstore.userservice.dto.request.ResetPasswordRequest;
import com.petstore.userservice.dto.response.AuthResponse;
import com.petstore.userservice.dto.response.MessageResponse;
import com.petstore.userservice.service.KeycloakAuthService;

import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class KeycloakAuthServiceImpl implements KeycloakAuthService {

    private final Keycloak keycloak;
    private final RestTemplate restTemplate;

    @Value("${keycloak.server-url}")
    private String serverUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.client-id}")
    private String clientId;

    @Value("${keycloak.client-secret}")
    private String clientSecret;

    @Override
    public MessageResponse register(RegisterRequest request) {
        try {
            
            RealmResource realmResource = keycloak.realm(realm);
            UsersResource usersResource = realmResource.users();

            List<UserRepresentation> existingEmails = usersResource.searchByEmail(request.getEmail(), true);
            if (!existingEmails.isEmpty()) {
                log.warn("Email already exists: {}", request.getEmail());
                return MessageResponse.builder()
                        .message("Email already exists")
                        .success(false)
                        .build();
            }

            UserRepresentation user = new UserRepresentation();
            user.setUsername(request.getEmail());
            user.setEmail(request.getEmail());
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setEnabled(true);
            user.setEmailVerified(false);
            user.setRequiredActions(List.of());

            Response response = usersResource.create(user);
            log.info("Keycloak create user response status: {}", response.getStatus());

            if (response.getStatus() == 201) {
                String locationPath = response.getLocation().getPath();
                String userId = locationPath.substring(locationPath.lastIndexOf('/') + 1);
                log.info("User created with ID: {}", userId);

                CredentialRepresentation credential = new CredentialRepresentation();
                credential.setType(CredentialRepresentation.PASSWORD);
                credential.setValue(request.getPassword());
                credential.setTemporary(false);

                usersResource.get(userId).resetPassword(credential);
                log.info("Password set for user: {}", userId);

                return MessageResponse.builder()
                        .message("User registered successfully")
                        .success(true)
                        .build();
            } else {
                String errorMsg = response.readEntity(String.class);
                log.error("Failed to register user. Status: {}, Error: {}", response.getStatus(), errorMsg);
                return MessageResponse.builder()
                        .message("Failed to register user: " + errorMsg)
                        .success(false)
                        .build();
            }
        } catch (Exception e) {
            log.error("Error during registration for user: {}", request.getEmail(), e);
            return MessageResponse.builder()
                    .message("Registration failed: " + e.getMessage())
                    .success(false)
                    .build();
        }
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        try {
            String tokenUrl = serverUrl + "/realms/" + realm + "/protocol/openid-connect/token";
            log.info("Attempting login for email: {} at URL: {}", request.getEmail(), tokenUrl);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("grant_type", "password");
            body.add("client_id", clientId);
            body.add("client_secret", clientSecret);
            body.add("username", request.getEmail());
            body.add("password", request.getPassword());

            log.info("Login request: grant_type=password, client_id={}, username={}", clientId, request.getEmail());

            HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.exchange(tokenUrl, HttpMethod.POST, entity, Map.class);

            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null) {
                log.info("Login successful for user: {}", request.getEmail());
                return AuthResponse.builder()
                        .accessToken((String) responseBody.get("access_token"))
                        .refreshToken((String) responseBody.get("refresh_token"))
                        .tokenType((String) responseBody.get("token_type"))
                        .expiresIn((Integer) responseBody.get("expires_in"))
                        .refreshExpiresIn((Integer) responseBody.get("refresh_expires_in"))
                        .build();
            }
            throw new RuntimeException("Login failed: Empty response");
        } catch (Exception e) {
            log.error("Error during login for user: {}", request.getEmail(), e);
            throw new RuntimeException("Login failed: " + e.getMessage());
        }
    }

    @Override
    public MessageResponse logout(String refreshToken) {
        try {
            String logoutUrl = serverUrl + "/realms/" + realm + "/protocol/openid-connect/logout";
            log.info("Attempting logout at URL: {}", logoutUrl);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("client_id", clientId);
            body.add("client_secret", clientSecret);
            body.add("refresh_token", refreshToken);

            HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(body, headers);
            restTemplate.exchange(logoutUrl, HttpMethod.POST, entity, String.class);

            log.info("Logout successful");
            return MessageResponse.builder()
                    .message("Logout successful")
                    .success(true)
                    .build();
        } catch (Exception e) {
            log.error("Error during logout", e);
            return MessageResponse.builder()
                    .message("Logout failed: " + e.getMessage())
                    .success(false)
                    .build();
        }
    }

    @Override
    public MessageResponse forgotPassword(ForgotPasswordRequest request) {
        try {
            log.info("Processing forgot password for email: {}", request.getEmail());
            
            RealmResource realmResource = keycloak.realm(realm);
            UsersResource usersResource = realmResource.users();

            List<UserRepresentation> users = usersResource.searchByEmail(request.getEmail(), true);

            if (users.isEmpty()) {
                log.warn("User not found with email: {}", request.getEmail());
                return MessageResponse.builder()
                        .message("User not found")
                        .success(false)
                        .build();
            }

            UserRepresentation user = users.get(0);
            log.info("Sending password reset email to user: {}", user.getEmail());
            
            usersResource.get(user.getId()).executeActionsEmail(Collections.singletonList("UPDATE_PASSWORD"));

            return MessageResponse.builder()
                    .message("Password reset email sent successfully")
                    .success(true)
                    .build();
        } catch (Exception e) {
            log.error("Error during forgot password for email: {}", request.getEmail(), e);
            return MessageResponse.builder()
                    .message("Failed to send reset email: " + e.getMessage())
                    .success(false)
                    .build();
        }
    }

    @Override
    public MessageResponse resetPassword(String userId, ResetPasswordRequest request) {
        try {
            log.info("Resetting password for user ID: {}", userId);
            
            RealmResource realmResource = keycloak.realm(realm);
            UsersResource usersResource = realmResource.users();

            CredentialRepresentation credential = new CredentialRepresentation();
            credential.setType(CredentialRepresentation.PASSWORD);
            credential.setValue(request.getNewPassword());
            credential.setTemporary(false);

            usersResource.get(userId).resetPassword(credential);
            log.info("Password reset successful for user ID: {}", userId);

            return MessageResponse.builder()
                    .message("Password reset successfully")
                    .success(true)
                    .build();
        } catch (Exception e) {
            log.error("Error during password reset for user ID: {}", userId, e);
            return MessageResponse.builder()
                    .message("Password reset failed: " + e.getMessage())
                    .success(false)
                    .build();
        }
    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {
        try {
            String tokenUrl = serverUrl + "/realms/" + realm + "/protocol/openid-connect/token";
            log.info("Attempting to refresh token at URL: {}", tokenUrl);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("grant_type", "refresh_token");
            body.add("client_id", clientId);
            body.add("client_secret", clientSecret);
            body.add("refresh_token", refreshToken);

            HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.exchange(tokenUrl, HttpMethod.POST, entity, Map.class);

            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null) {
                log.info("Token refresh successful");
                return AuthResponse.builder()
                        .accessToken((String) responseBody.get("access_token"))
                        .refreshToken((String) responseBody.get("refresh_token"))
                        .tokenType((String) responseBody.get("token_type"))
                        .expiresIn((Integer) responseBody.get("expires_in"))
                        .refreshExpiresIn((Integer) responseBody.get("refresh_expires_in"))
                        .build();
            }
            throw new RuntimeException("Token refresh failed: Empty response");
        } catch (Exception e) {
            log.error("Error during token refresh", e);
            throw new RuntimeException("Token refresh failed: " + e.getMessage());
        }
    }
}

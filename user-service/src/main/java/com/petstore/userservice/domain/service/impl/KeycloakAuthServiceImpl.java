package com.petstore.userservice.domain.service.impl;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import com.petstore.userservice.api.dto.request.ForgotPasswordRequest;
import com.petstore.userservice.api.dto.request.LoginRequest;
import com.petstore.userservice.api.dto.request.RegisterRequest;
import com.petstore.userservice.api.dto.request.ResetPasswordRequest;
import com.petstore.userservice.domain.service.KeycloakAuthService;
import com.petstore.userservice.domain.service.UserService;
import com.petstore.userservice.exception.AuthenticationException;
import com.petstore.userservice.exception.DuplicateException;
import com.petstore.userservice.exception.IdentityProviderException;
import com.petstore.userservice.exception.ResourceNotFoundException;

import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class KeycloakAuthServiceImpl implements KeycloakAuthService {

    private final Keycloak keycloak;
    private final RestClient restClient;
    private final UserService userService;

    @Value("${keycloak.server-url}")
    private String serverUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.client-id}")
    private String clientId;

    @Value("${keycloak.client-secret}")
    private String clientSecret;

    @Override
    public void register(RegisterRequest request) {
        RealmResource realmResource = keycloak.realm(realm);
        UsersResource usersResource = realmResource.users();

        List<UserRepresentation> existingEmails = usersResource.searchByEmail(request.getEmail(), true);
        if (!existingEmails.isEmpty()) {
            log.warn("Email already exists: {}", request.getEmail());
            throw new DuplicateException("Email already in use");
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
            String keycloakId = locationPath.substring(locationPath.lastIndexOf('/') + 1);
            log.info("User created with ID: {}", keycloakId);

            CredentialRepresentation credential = new CredentialRepresentation();
            credential.setType(CredentialRepresentation.PASSWORD);
            credential.setValue(request.getPassword());
            credential.setTemporary(false);

            usersResource.get(keycloakId).resetPassword(credential);
            log.info("Password set for user: {}", keycloakId);

            userService.createUser(keycloakId, request);
        } else {
            String errorMsg = response.readEntity(String.class);
            log.error("Failed to register user. Status: {}, Error: {}", response.getStatus(), errorMsg);
            throw new IdentityProviderException(errorMsg);
        }
    }

    @Override
    public Map<String, Object> login(LoginRequest request) {
        String tokenUrl = serverUrl + "/realms/" + realm + "/protocol/openid-connect/token";
        log.info("Attempting login for email: {} at URL: {}", request.getEmail(), tokenUrl);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "password");
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("username", request.getEmail());
        body.add("password", request.getPassword());

        log.info("Login request: grant_type=password, client_id={}, username={}", clientId, request.getEmail());

        try {
            Map<String, Object> responseBody = restClient.post()
                    .uri(tokenUrl)
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(body)
                    .retrieve()
                    .body(Map.class);

            if (responseBody == null) {
                log.error("Login failed: Empty response for user: {}", request.getEmail());
                throw new AuthenticationException("Login failed: Invalid credentials or empty response");
            }
            
            log.info("Login successful for user: {}", request.getEmail());
            return responseBody;
        } catch (org.springframework.web.client.RestClientResponseException ex) {
            log.error("Login failed for user: {}. Error: {}", request.getEmail(), ex.getMessage());
            throw new AuthenticationException("Invalid email or password");
        } catch (Exception ex) {
            log.error("Unexpected error during login for user: {}. Error: {}", request.getEmail(), ex.getMessage());
            throw new AuthenticationException("Login failed due to server error");
        }
    }

    @Override
    public void logout(String refreshToken) {
        String logoutUrl = serverUrl + "/realms/" + realm + "/protocol/openid-connect/logout";
        log.info("Attempting logout at URL: {}", logoutUrl);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("refresh_token", refreshToken);

        try {
            restClient.post()
                    .uri(logoutUrl)
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(body)
                    .retrieve()
                    .toBodilessEntity();

            log.info("Logout successful");
        } catch (org.springframework.web.client.RestClientResponseException ex) {
            log.error("Logout failed. Error: {}", ex.getMessage());
            throw new AuthenticationException("Logout failed: Invalid or expired refresh token");
        } catch (Exception ex) {
            log.error("Unexpected error during logout. Error: {}", ex.getMessage());
            throw new AuthenticationException("Logout failed due to server error");
        }
    }

    @Override
    public void forgotPassword(ForgotPasswordRequest request) {
        log.info("Processing forgot password for email: {}", request.getEmail());
        
        RealmResource realmResource = keycloak.realm(realm);
        UsersResource usersResource = realmResource.users();

        List<UserRepresentation> users = usersResource.searchByEmail(request.getEmail(), true);

        if (users.isEmpty()) {
            log.warn("User not found with email: {}", request.getEmail());
            throw new ResourceNotFoundException("User not found with email: " + request.getEmail());
        }

        UserRepresentation user = users.getFirst();
        log.info("Sending password reset email to user: {}", user.getEmail());
        
        usersResource.get(user.getId()).executeActionsEmail(Collections.singletonList("UPDATE_PASSWORD"));
        log.info("Password reset email sent successfully to: {}", request.getEmail());
    }

    @Override
    public void resetPassword(String keycloakId, ResetPasswordRequest request) {
        log.info("Resetting password for user ID: {}", keycloakId);
        
        RealmResource realmResource = keycloak.realm(realm);
        UsersResource usersResource = realmResource.users();

        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(request.getNewPassword());
        credential.setTemporary(false);

        usersResource.get(keycloakId).resetPassword(credential);
        log.info("Password reset successful for user ID: {}", keycloakId);
    }

    @Override
    public Map<String, Object> refreshToken(String refreshToken) {
        String tokenUrl = serverUrl + "/realms/" + realm + "/protocol/openid-connect/token";
        log.info("Attempting to refresh token at URL: {}", tokenUrl);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "refresh_token");
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("refresh_token", refreshToken);

        try {
            Map<String, Object> responseBody = restClient.post()
                    .uri(tokenUrl)
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(body)
                    .retrieve()
                    .body(Map.class);

            if (responseBody == null) {
                log.error("Token refresh failed: Empty response");
                throw new AuthenticationException("Token refresh failed: Invalid or expired refresh token");
            }
            
            log.info("Token refresh successful");
            return responseBody;
        } catch (org.springframework.web.client.RestClientResponseException ex) {
            log.error("Token refresh failed. Error: {}", ex.getMessage());
            throw new AuthenticationException("Invalid or expired refresh token");
        } catch (Exception ex) {
            log.error("Unexpected error during token refresh. Error: {}", ex.getMessage());
            throw new AuthenticationException("Token refresh failed due to server error");
        }
    }
}

package com.petstore.orderservice.infra.client;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.petstore.orderservice.api.dto.UserDTO;
import com.petstore.orderservice.api.dto.response.UserProfileIdResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserClient {

    @Qualifier("userRestClient")
    private final RestClient userRestClient;

    /**
     * Resolves the internal application user id (user-service DB UUID) using the same Bearer token
     * the client used for order-service. Checkout stores orders under this id, not Keycloak {@code sub}.
     */
    public java.util.UUID getInternalUserIdFromBearer(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return null;
        }
        try {
            UserProfileIdResponse body = userRestClient.get()
                    .uri("/me/profile")
                    .header("Authorization", authorizationHeader)
                    .retrieve()
                    .body(UserProfileIdResponse.class);
            return body != null ? body.getId() : null;
        } catch (Exception e) {
            log.error("Failed to resolve internal user id from /me/profile", e);
            return null;
        }
    }

    public UserDTO getUserById(UUID userId) {
        try {
            return userRestClient.get()
                    .uri("/api/public/users/{userId}", userId)
                    .retrieve()
                    .body(UserDTO.class);
        } catch (Exception e) {
            log.error("Failed to get user by id: {}", userId, e);
            // Return null instead of throwing exception to avoid breaking order listing
            return null;
        }
    }
}

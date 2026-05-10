package com.petstore.orderservice.infra.client;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.petstore.orderservice.api.dto.UserDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserClient {

    @Qualifier("userRestClient")
    private final RestClient userRestClient;

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

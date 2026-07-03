package com.petstore.notificationservice.infra.client.impl;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import com.petstore.notificationservice.infra.client.UserClient;

@Component
public class UserClientImpl implements UserClient {
    private final RestClient restClient;
    private final String apiKey;

    public UserClientImpl(
            @Qualifier("userRestClient") RestClient restClient,
            @Value("${api-key.value}") String apiKey) {
        this.restClient = restClient;
        this.apiKey = apiKey;
    }

    @Override
    public UserInfo getUser(UUID userId) {
        return restClient.get()
                .uri("/api/private/users/{userId}", userId)
                .header("X-API-KEY", apiKey)
                .retrieve()
                .onStatus(HttpStatusCode::isError, (req, res) -> {
                    throw new RuntimeException("User not found: " + userId);
                })
                .body(UserInfo.class);
    }
}

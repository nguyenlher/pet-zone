package com.petstore.orderservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {
    @Value("${rest.api.user-service.baseUrl}")
    private String userServiceBaseUrl;

    @Value("${rest.api.pet-service.baseUrl}")
    private String petServiceBaseUrl;

    @Bean
    public RestClient userRestClient() {
        return RestClient.builder().baseUrl(userServiceBaseUrl).build();
    }

    @Bean
    public RestClient petRestClient() {
        return RestClient.builder().baseUrl(petServiceBaseUrl).build();
    }
}

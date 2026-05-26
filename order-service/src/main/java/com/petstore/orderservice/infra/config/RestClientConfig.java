package com.petstore.orderservice.infra.config;

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

    @Value("${rest.api.payment-service.baseUrl}")
    private String paymentServiceBaseUrl;

    @Value("${api.key:HmYCvFBJKWzhJlVH498UjNAdCKC8vwhp}")
    private String apiKey;

    @Bean
    public RestClient userRestClient() {
        return RestClient.builder()
                .baseUrl(userServiceBaseUrl)
                .defaultHeader("X-API-KEY", apiKey)
                .build();
    }

    @Bean
    public RestClient petRestClient() {
        return RestClient.builder()
                .baseUrl(petServiceBaseUrl)
                .defaultHeader("X-API-KEY", apiKey)
                .build();
    }

    @Bean
    public RestClient paymentRestClient() {
        return RestClient.builder()
                .baseUrl(paymentServiceBaseUrl)
                .defaultHeader("X-API-KEY", apiKey)
                .build();
    }
}

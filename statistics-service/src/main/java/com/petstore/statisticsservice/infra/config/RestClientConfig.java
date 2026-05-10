package com.petstore.statisticsservice.infra.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    @Value("${services.order-service.url}")
    private String orderServiceBaseUrl;

    @Value("${services.payment-service.url}")
    private String paymentServiceBaseUrl;

    @Value("${services.pet-service.url}")
    private String petServiceBaseUrl;

    @Value("${services.user-service.url}")
    private String userServiceBaseUrl;

    @Bean
    public RestClient orderRestClient() {
        return RestClient.builder()
                .baseUrl(orderServiceBaseUrl)
                .build();
    }

    @Bean
    public RestClient paymentRestClient() {
        return RestClient.builder()
                .baseUrl(paymentServiceBaseUrl)
                .build();
    }

    @Bean
    public RestClient petRestClient() {
        return RestClient.builder()
                .baseUrl(petServiceBaseUrl)
                .build();
    }

    @Bean
    public RestClient userRestClient() {
        return RestClient.builder()
                .baseUrl(userServiceBaseUrl)
                .build();
    }
}

package com.petstore.statisticsservice.infra.config;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.JdkClientHttpRequestFactory;
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

    @Value("${api.key:HmYCvFBJKWzhJlVH498UjNAdCKC8vwhp}")
    private String apiKey;

    private JdkClientHttpRequestFactory createRequestFactory() {
        JdkClientHttpRequestFactory factory = new JdkClientHttpRequestFactory();
        factory.setReadTimeout(Duration.ofSeconds(10));
        return factory;
    }

    @Bean
    public RestClient orderRestClient() {
        return RestClient.builder()
                .baseUrl(orderServiceBaseUrl)
                .defaultHeader("X-API-KEY", apiKey)
                .requestFactory(createRequestFactory())
                .build();
    }

    @Bean
    public RestClient paymentRestClient() {
        return RestClient.builder()
                .baseUrl(paymentServiceBaseUrl)
                .defaultHeader("X-API-KEY", apiKey)
                .requestFactory(createRequestFactory())
                .build();
    }

    @Bean
    public RestClient petRestClient() {
        return RestClient.builder()
                .baseUrl(petServiceBaseUrl)
                .defaultHeader("X-API-KEY", apiKey)
                .requestFactory(createRequestFactory())
                .build();
    }

    @Bean
    public RestClient userRestClient() {
        return RestClient.builder()
                .baseUrl(userServiceBaseUrl)
                .defaultHeader("X-API-KEY", apiKey)
                .requestFactory(createRequestFactory())
                .build();
    }
}

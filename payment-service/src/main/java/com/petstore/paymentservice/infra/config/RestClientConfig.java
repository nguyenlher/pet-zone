package com.petstore.paymentservice.infra.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {
    @Value("${services.order-service.url}")
    private String orderServiceBaseUrl;

    @Bean
    public RestClient orderRestClient() {
        return RestClient.builder()
                .baseUrl(orderServiceBaseUrl)
                .build();
    }
}

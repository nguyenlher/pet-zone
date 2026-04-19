package com.petstore.paymentservice.infra.client.impl;

import com.petstore.paymentservice.domain.client.OrderClient;
import com.petstore.paymentservice.domain.client.OrderInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.UUID;

@Slf4j
@Component
public class OrderClientImpl implements OrderClient {

    private final RestClient restClient;
    private final String apiKey;

    public OrderClientImpl(
            @Qualifier("orderRestClient") RestClient restClient,
            @Value("${api-key.value}") String apiKey) {
        this.restClient = restClient;
        this.apiKey = apiKey;
    }

    @Override
    public OrderInfo getOrder(UUID orderId) {
        return restClient.get()
                .uri("/private/orders/{id}", orderId)
                .retrieve()
                .onStatus(HttpStatusCode::isError, (req, res) -> {
                    throw new RuntimeException("Order not found: " + orderId);
                })
                .body(OrderInfo.class);
    }
}

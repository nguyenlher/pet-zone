package com.petstore.apigateway.resolve;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import com.petstore.apigateway.utils.JwtUtil;

import reactor.core.publisher.Mono;

@Component("userKeyResolver")
public class UserKeyResolver implements KeyResolver {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public Mono<String> resolve(ServerWebExchange exchange) {

        String authHeader = exchange.getRequest()
                .getHeaders()
                .getFirst("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return Mono.just("anonymous");
        }

        String token = authHeader.substring(7);

        try {
            String userId = jwtUtil.extractUserId(token);
            return Mono.just(userId);
        } catch (Exception e) {
            return Mono.just("invalid-token");
        }
    }
}
package com.petstore.apigateway.resolve;

import java.util.Objects;

import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import reactor.core.publisher.Mono;

@Component("ipKeyResolver")
@Primary
public class IpKeyResolver implements KeyResolver {

    @Override
    public Mono<String> resolve(ServerWebExchange exchange) {

        String ip = Objects.requireNonNull(exchange.getRequest()
                        .getRemoteAddress())
                .getAddress()
                .getHostAddress();

        return Mono.just(ip);
    }
}
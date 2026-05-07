package com.petstore.paymentservice.infra.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Allow private endpoints for inter-service communication
                .requestMatchers("/private/**").permitAll()
                // Allow VNPay callback endpoint
                .requestMatchers("/api/payments/vnpay-callback").permitAll()
                // Allow actuator endpoints
                .requestMatchers("/actuator/**").permitAll()
                // All other requests need authentication
                .anyRequest().authenticated()
            );

        return http.build();
    }
}

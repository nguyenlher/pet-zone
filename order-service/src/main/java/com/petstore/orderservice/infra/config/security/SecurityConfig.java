package com.petstore.orderservice.infra.config.security;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.beans.factory.annotation.Value;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Security Configuration for Order Service
 * Configures JWT role extraction and method-level security
 */
@Slf4j
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final FilterConfig filterConfig;

    @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri}")
    private String jwkSetUri;

    @Bean
    public JwtDecoder jwtDecoder() {
        log.info("Configuring JwtDecoder with JWK Set URI: {}", jwkSetUri);
        return NimbusJwtDecoder.withJwkSetUri(jwkSetUri).build();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(AbstractHttpConfigurer::disable)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(filterConfig, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        return http.build();
    }

    /**
     * JWT Authentication Converter
     * Extracts roles from Keycloak JWT token and converts them to Spring Security authorities
     * 
     * Keycloak JWT structure:
     * {
     *   "realm_access": {
     *     "roles": ["USER", "ADMIN"]
     *   }
     * }
     * 
     * Converts to Spring Security authorities: ["ROLE_USER", "ROLE_ADMIN"]
     */
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwt -> {
            Collection<GrantedAuthority> authorities = new ArrayList<>();
            
            try {
                // Extract roles from realm_access.roles (Keycloak default structure)
                Map<String, Object> realmAccess = jwt.getClaim("realm_access");
                
                if (realmAccess != null && realmAccess.containsKey("roles")) {
                    @SuppressWarnings("unchecked")
                    List<String> roles = (List<String>) realmAccess.get("roles");
                    
                    authorities = new ArrayList<>(roles.stream()
                            .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                            .toList());
                    
                    log.debug("Extracted roles from JWT: {}", roles);
                }
                
                // Fallback: try direct "roles" claim
                if (authorities.isEmpty()) {
                    List<String> directRoles = jwt.getClaim("roles");
                    if (directRoles != null) {
                        authorities = new ArrayList<>(directRoles.stream()
                                .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                                .toList());
                        
                        log.debug("Extracted roles from direct claim: {}", directRoles);
                    }
                }
                
            } catch (Exception e) {
                log.error("Error extracting roles from JWT: {}", e.getMessage());
            }
            
            return authorities;
        });
        
        return jwtAuthenticationConverter;
    }
}

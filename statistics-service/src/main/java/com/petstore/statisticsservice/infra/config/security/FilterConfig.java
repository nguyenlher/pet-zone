package com.petstore.statisticsservice.infra.config.security;

import java.io.IOException;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import org.springframework.context.annotation.Lazy;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

/**
 * Custom Filter for handling authentication in Statistics Service
 * Authentication Strategy:
 * - /api/public/** : JWT Token required (admin only - statistics are sensitive)
 * - /api/private/** : X-API-KEY required (internal microservice communication)
 */
@Slf4j
@Component
public class FilterConfig extends OncePerRequestFilter {

    private final JwtDecoder jwtDecoder;
    private final String apiKey;
    private final ObjectMapper objectMapper;

    public FilterConfig(
            @Lazy JwtDecoder jwtDecoder,
            @Value("${api-key.value:default-secret-key}") String apiKey) {
        this.jwtDecoder = jwtDecoder;
        this.apiKey = apiKey;
        this.objectMapper = new ObjectMapper();
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        
        String path = request.getRequestURI();
        String method = request.getMethod();
        log.debug("FilterConfig - Processing request: {} {}", method, path);

        // 1. User endpoints - JWT Token required (role check will be done at controller level)
        if (path.startsWith("/statistics")) {
            String authHeader = request.getHeader("Authorization");
            log.debug("FilterConfig - User endpoint, Authorization: {}", 
                    authHeader != null ? "Present" : "Missing");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                try {
                    Jwt jwt = jwtDecoder.decode(token);
                    
                    // Extract roles
                    java.util.Collection<org.springframework.security.core.GrantedAuthority> authorities = new java.util.ArrayList<>();
                    java.util.Map<String, Object> realmAccess = jwt.getClaim("realm_access");
                    if (realmAccess != null && realmAccess.containsKey("roles")) {
                        @SuppressWarnings("unchecked")
                        java.util.List<String> roles = (java.util.List<String>) realmAccess.get("roles");
                        roles.forEach(role -> authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + role)));
                    } else if (jwt.getClaim("roles") != null) {
                        @SuppressWarnings("unchecked")
                        java.util.List<String> roles = (java.util.List<String>) jwt.getClaim("roles");
                        roles.forEach(role -> authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + role)));
                    }

                    JwtAuthenticationToken authentication = new JwtAuthenticationToken(jwt, authorities);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    
                    log.debug("FilterConfig - JWT validated for user: {}", jwt.getSubject());
                    request.setAttribute("claims", jwt.getClaims());
                    filterChain.doFilter(request, response);
                    return;
                } catch (JwtException | IllegalArgumentException e) {
                    log.error("FilterConfig - JWT validation failed: {}", e.getMessage());
                    sendError(response, HttpStatus.UNAUTHORIZED, "Invalid or expired token");
                    return;
                }
            }

            log.warn("FilterConfig - Missing JWT token for statistics endpoint: {} {}", method, path);
            sendError(response, HttpStatus.UNAUTHORIZED, "Authentication required");
            return;
        }

        // 2. Internal microservice endpoints - X-API-KEY required
        if (path.startsWith("/private")) {
            String headerApiKey = request.getHeader("X-API-KEY");
            log.debug("FilterConfig - Internal endpoint, X-API-KEY: {}", 
                    headerApiKey != null ? "Present" : "Missing");

            if (headerApiKey != null && headerApiKey.equals(apiKey)) {
                log.debug("FilterConfig - API Key validated for internal call: {}", path);
                filterChain.doFilter(request, response);
                return;
            }

            log.warn("FilterConfig - Invalid or missing API Key for internal endpoint: {}", path);
            sendError(response, HttpStatus.FORBIDDEN, "Invalid or missing API key");
            return;
        }

        // 3. Reject unmatched paths
        log.warn("FilterConfig - Unmatched path, returning 403: {} {}", method, path);
        sendError(response, HttpStatus.FORBIDDEN, "Access to the resource is prohibited");
    }

    private void sendError(HttpServletResponse response, HttpStatus status, String message) 
            throws IOException {
        response.setStatus(status.value());
        response.setContentType("application/json");
        objectMapper.writeValue(response.getWriter(),
                Map.of(
                    "errorCode", status.value(),
                    "message", message,
                    "success", false
                ));
    }


}

package com.petstore.notificationservice.infra.config.security;

import java.io.IOException;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

/**
 * Custom Filter for handling authentication in Notification Service
 * - /api/public/** : JWT Token required
 * - /api/private/** : X-API-KEY required (service-to-service)
 */
@Slf4j
@Component
public class FilterConfig extends OncePerRequestFilter {

    private final SecretKey secretKey;
    private final String apiKey;
    private final ObjectMapper objectMapper;

    public FilterConfig(
            @Value("${jwt.secret}") String secret,
            @Value("${api-key.value:default-secret-key}") String apiKey) {
        this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        this.apiKey = apiKey;
        this.objectMapper = new ObjectMapper();
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {
        
        String path = request.getRequestURI();
        log.debug("FilterConfig - Processing request: {}", path);

        // 1. Validate JWT Token for /api/public/** endpoints
        if (path.startsWith("/api/public")) {
            String authHeader = request.getHeader("Authorization");
            log.debug("FilterConfig - Public endpoint, Authorization header: {}", 
                    authHeader != null ? "Present" : "Missing");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                try {
                    Claims claims = Jwts.parser()
                            .verifyWith(secretKey)
                            .build()
                            .parseSignedClaims(token)
                            .getPayload();
                    
                    if (claims != null) {
                        log.debug("FilterConfig - JWT validated successfully for: {}", path);
                        request.setAttribute("claims", claims);
                        filterChain.doFilter(request, response);
                        return;
                    }
                } catch (io.jsonwebtoken.JwtException | IllegalArgumentException e) {
                    log.error("FilterConfig - Token validation error: {}", e.getMessage());
                    sendError(response, HttpStatus.UNAUTHORIZED, "Invalid or expired token");
                    return;
                }
            }

            log.warn("FilterConfig - Missing or invalid token for public endpoint: {}", path);
            sendError(response, HttpStatus.UNAUTHORIZED, "Authentication required");
            return;
        }

        // 2. Validate X-API-KEY for /api/private/** endpoints
        if (path.startsWith("/api/private")) {
            String headerApiKey = request.getHeader("X-API-KEY");
            log.debug("FilterConfig - Private endpoint, X-API-KEY: {}", 
                    headerApiKey != null ? "Present" : "Missing");

            if (headerApiKey != null && headerApiKey.equals(apiKey)) {
                log.debug("FilterConfig - API Key validated successfully for: {}", path);
                filterChain.doFilter(request, response);
                return;
            }

            log.warn("FilterConfig - Invalid or missing API Key for private endpoint: {}", path);
            sendError(response, HttpStatus.FORBIDDEN, "Invalid or missing API key");
            return;
        }

        // 3. Reject unmatched paths
        log.warn("FilterConfig - Path not matched, returning 403: {}", path);
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

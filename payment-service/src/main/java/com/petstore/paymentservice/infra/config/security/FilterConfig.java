package com.petstore.paymentservice.infra.config.security;

import java.io.IOException;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
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
 * Custom Filter for handling authentication in Payment Service
 * Authentication Strategy:
 * - /api/public/** : JWT Token required (all payment operations require authentication)
 * - /api/private/** : X-API-KEY required (internal microservice communication)
 */
@Slf4j
@Component
public class FilterConfig extends OncePerRequestFilter {

    private final SecretKey secretKey;
    private final String apiKey;
    private final ObjectMapper objectMapper;

    public FilterConfig(
            @Value("${jwt.secret}") String secret,
            @Value("${api.key:HmYCvFBJKWzhJlVH498UjNAdCKC8vwhp}") String apiKey) {
        this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
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

        // 0. Public callback endpoints - No authentication required (VNPay/payment gateway callbacks)
        if (path.matches("/public/payments/(callback|ipn)/.*")) {
            log.debug("FilterConfig - Payment callback/IPN endpoint, no auth required: {}", path);
            filterChain.doFilter(request, response);
            return;
        }

        // 1. User endpoints - JWT Token required (payments are always user-specific)
        if (path.startsWith("/public")) {
            String authHeader = request.getHeader("Authorization");
            log.debug("FilterConfig - User endpoint, Authorization: {}", 
                    authHeader != null ? "Present" : "Missing");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                try {
                    Claims claims = Jwts.parser()
                            .verifyWith(secretKey)
                            .build()
                            .parseSignedClaims(token)
                            .getPayload();
                    
                    // Create Spring Security JWT and set in SecurityContext
                    Jwt jwt = createSpringJwt(claims, token);
                    
                    // Extract roles
                    java.util.Collection<org.springframework.security.core.GrantedAuthority> authorities = new java.util.ArrayList<>();
                    java.util.Map<String, Object> realmAccess = claims.get("realm_access", java.util.Map.class);
                    if (realmAccess != null && realmAccess.containsKey("roles")) {
                        @SuppressWarnings("unchecked")
                        java.util.List<String> roles = (java.util.List<String>) realmAccess.get("roles");
                        roles.forEach(role -> authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + role)));
                    } else if (claims.get("roles") != null) {
                        @SuppressWarnings("unchecked")
                        java.util.List<String> roles = (java.util.List<String>) claims.get("roles");
                        roles.forEach(role -> authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + role)));
                    }
                    
                    JwtAuthenticationToken authentication = new JwtAuthenticationToken(jwt, authorities);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    
                    log.debug("FilterConfig - JWT validated for user: {}", claims.getSubject());
                    request.setAttribute("claims", claims);
                    filterChain.doFilter(request, response);
                    return;
                } catch (io.jsonwebtoken.JwtException | IllegalArgumentException e) {
                    log.error("FilterConfig - JWT validation failed: {}", e.getMessage());
                    sendError(response, HttpStatus.UNAUTHORIZED, "Invalid or expired token");
                    return;
                }
            }

            log.warn("FilterConfig - Missing JWT token for payment endpoint: {} {}", method, path);
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

    /**
     * Convert JJWT Claims to Spring Security Jwt
     */
    private Jwt createSpringJwt(Claims claims, String tokenValue) {
        return Jwt.withTokenValue(tokenValue)
                .header("alg", "HS256")
                .header("typ", "JWT")
                .subject(claims.getSubject())
                .issuedAt(claims.getIssuedAt() != null ? claims.getIssuedAt().toInstant() : null)
                .expiresAt(claims.getExpiration() != null ? claims.getExpiration().toInstant() : null)
                .claims(claimsMap -> claimsMap.putAll(claims))
                .build();
    }
}

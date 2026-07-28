package com.petstore.userservice.api.controller.publ;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.petstore.userservice.api.dto.request.ForgotPasswordRequest;
import com.petstore.userservice.api.dto.request.LoginRequest;
import com.petstore.userservice.api.dto.request.RegisterRequest;
import com.petstore.userservice.api.dto.request.ResetPasswordRequest;
import com.petstore.userservice.api.dto.response.AuthResponse;
import com.petstore.userservice.api.dto.response.MessageResponse;
import com.petstore.userservice.exception.CaptchaValidationException;
import com.petstore.userservice.infra.integration.captcha.CaptchaService;
import com.petstore.userservice.infra.integration.keycloak.KeycloakAuthService;
import com.petstore.userservice.infra.mapper.AuthMapper;
import com.petstore.userservice.utils.UserApiPath;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Public Auth Controller
 * Handles authentication operations (no authentication required)
 * Endpoint: /api/auth/**
 */
@Slf4j
@RestController
@RequestMapping(UserApiPath.AUTH_BASE)
@RequiredArgsConstructor
public class PublicAuthController {

    private final KeycloakAuthService keycloakAuthService;
    private final CaptchaService captchaService;
    private final AuthMapper authMapper;

    @PostMapping(UserApiPath.AUTH_REGISTER)
    public ResponseEntity<MessageResponse> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletRequest httpRequest) {
        log.info("Public Auth API: User registration attempt for email: {}", request.getEmail());

        String clientIp = extractClientIp(httpRequest);
        boolean isCaptchaValid = captchaService.verify(request.getCaptchaToken(), clientIp);
        if (!isCaptchaValid) {
            log.warn("Public Auth API: Captcha validation failed for registration attempt with email: {}", request.getEmail());
            throw new CaptchaValidationException("Xác thực Captcha không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.");
        }

        keycloakAuthService.register(request);
        return ResponseEntity.ok(MessageResponse.builder()
                .message("Registration successful")
                .success(true)
                .build());
    }

    private String extractClientIp(HttpServletRequest request) {
        if (request == null) {
            return null;
        }
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    @PostMapping(UserApiPath.AUTH_LOGIN)
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest) {
        log.info("Public Auth API: User login attempt for email: {}", request.getEmail());

        String clientIp = extractClientIp(httpRequest);
        boolean isCaptchaValid = captchaService.verify(request.getCaptchaToken(), clientIp);
        if (!isCaptchaValid) {
            log.warn("Public Auth API: Captcha validation failed for login attempt with email: {}", request.getEmail());
            throw new CaptchaValidationException("Xác thực Captcha không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.");
        }

        Map<String, Object> tokenData = keycloakAuthService.login(request);
        AuthResponse authResponse = authMapper.toAuthResponse(tokenData);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping(UserApiPath.AUTH_LOGOUT)
    public ResponseEntity<MessageResponse> logout(@RequestParam String refreshToken) {
        log.info("Public Auth API: User logout");
        keycloakAuthService.logout(refreshToken);
        return ResponseEntity.ok(MessageResponse.builder()
                .message("Logout successful")
                .success(true)
                .build());
    }

    @PostMapping(UserApiPath.AUTH_FORGOT_PASSWORD)
    public ResponseEntity<MessageResponse> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request,
            HttpServletRequest httpRequest) {
        log.info("Public Auth API: Forgot password attempt for email: {}", request.getEmail());

        String clientIp = extractClientIp(httpRequest);
        boolean isCaptchaValid = captchaService.verify(request.getCaptchaToken(), clientIp);
        if (!isCaptchaValid) {
            log.warn("Public Auth API: Captcha validation failed for forgot password attempt with email: {}", request.getEmail());
            throw new CaptchaValidationException("Xác thực Captcha không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.");
        }

        keycloakAuthService.forgotPassword(request);
        return ResponseEntity.ok(MessageResponse.builder()
                .message("Password reset email sent successfully")
                .success(true)
                .build());
    }

    @PostMapping(UserApiPath.AUTH_RESET_PASSWORD)
    public ResponseEntity<MessageResponse> resetPassword(
            @PathVariable String keycloakId,
            @Valid @RequestBody ResetPasswordRequest request) {
        log.info("Public Auth API: Reset password for keycloakId: {}", keycloakId);
        keycloakAuthService.resetPassword(keycloakId, request);
        return ResponseEntity.ok(MessageResponse.builder()
                .message("Password reset successfully")
                .success(true)
                .build());
    }

    @PostMapping(UserApiPath.AUTH_REFRESH)
    public ResponseEntity<AuthResponse> refreshToken(@RequestParam String refreshToken) {
        log.info("Public Auth API: Refresh token");
        Map<String, Object> tokenData = keycloakAuthService.refreshToken(refreshToken);
        AuthResponse authResponse = authMapper.toAuthResponse(tokenData);
        return ResponseEntity.ok(authResponse);
    }
}

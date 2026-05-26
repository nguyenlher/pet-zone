package com.petstore.userservice.api.controller.publ;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.petstore.userservice.api.dto.request.UpdateProfileRequest;
import com.petstore.userservice.api.dto.response.UserResponse;
import com.petstore.userservice.domain.repository.UserShippingInfoRepository;
import com.petstore.userservice.domain.service.UserService;
import com.petstore.userservice.infra.mapper.UserMapper;
import com.petstore.userservice.utils.UserApiPath;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * User Profile Controller
 * Handles current user's profile operations (JWT authentication required)
 * Endpoint: /api/me/**
 */
@Slf4j
@RestController
@RequestMapping(UserApiPath.ME_BASE)
@RequiredArgsConstructor
public class PublicUserProfileController {

    private final UserService userService;
    private final UserShippingInfoRepository userShippingInfoRepository;
    private final UserMapper userMapper;

    /**
     * Get current user's profile
     * Accessible by: Any authenticated user
     */
    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile(@AuthenticationPrincipal Jwt jwt) {
        String keycloakId = jwt.getSubject();
        log.info("Me API: Fetching profile for keycloakId: {}", keycloakId);
        
        var user = userService.getProfile(keycloakId);
        UserResponse.UserResponseBuilder responseBuilder = userMapper.toUserDto(user).toBuilder();
        
        // Populate phone and address from default shipping info
        userShippingInfoRepository.findDefaultByUserId(user.getId()).ifPresent(shippingInfo -> {
            responseBuilder.phone(shippingInfo.getPhoneNumber());
            responseBuilder.address(shippingInfo.getAddress());
        });
        
        return ResponseEntity.ok(responseBuilder.build());
    }

    /**
     * Update current user's profile
     * Accessible by: Any authenticated user
     */
    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody UpdateProfileRequest request) {
        
        String keycloakId = jwt.getSubject();
        log.info("Me API: Updating profile for keycloakId: {}", keycloakId);
        
        var updatedUser = userService.updateProfile(keycloakId, request);
        UserResponse.UserResponseBuilder responseBuilder = userMapper.toUserDto(updatedUser).toBuilder();
        
        // Populate phone and address from default shipping info
        userShippingInfoRepository.findDefaultByUserId(updatedUser.getId()).ifPresent(shippingInfo -> {
            responseBuilder.phone(shippingInfo.getPhoneNumber());
            responseBuilder.address(shippingInfo.getAddress());
        });
        
        return ResponseEntity.ok(responseBuilder.build());
    }
}

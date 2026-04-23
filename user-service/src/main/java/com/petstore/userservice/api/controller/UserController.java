package com.petstore.userservice.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.petstore.userservice.api.dto.response.UserResponse;
import com.petstore.userservice.domain.service.UserService;
import com.petstore.userservice.utils.UserApiPath;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping(UserApiPath.USER_BASE)
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping(UserApiPath.USER_PROFILE)
    public ResponseEntity<UserResponse> getProfile(@AuthenticationPrincipal Jwt jwt) {
        String keycloakId = jwt.getSubject();
        log.info("Fetching profile for keycloakId: {}", keycloakId);
        return ResponseEntity.ok(userService.getProfile(keycloakId));
    }
}

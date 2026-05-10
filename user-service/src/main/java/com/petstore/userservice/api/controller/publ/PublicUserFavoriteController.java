package com.petstore.userservice.api.controller.publ;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.petstore.userservice.api.dto.request.AddFavoriteRequest;
import com.petstore.userservice.api.dto.response.MessageResponse;
import com.petstore.userservice.api.dto.response.UserFavoriteResponse;
import com.petstore.userservice.domain.service.UserFavoriteService;
import com.petstore.userservice.domain.service.UserService;
import com.petstore.userservice.infra.mapper.UserFavoriteMapper;
import com.petstore.userservice.utils.UserApiPath;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * User Favorite Controller
 * Handles user favorite operations (JWT authentication required)
 * Endpoint: /api/public/users/favorites/**
 */
@Slf4j
@RestController
@RequestMapping(UserApiPath.PUBLIC_USER_BASE + UserApiPath.FAVORITE_BASE)
@RequiredArgsConstructor
public class PublicUserFavoriteController {

    private final UserFavoriteService favoriteService;
    private final UserService userService;
    private final UserFavoriteMapper mapper;

    @GetMapping
    public ResponseEntity<List<UserFavoriteResponse>> getUserFavorites(
            @AuthenticationPrincipal Jwt jwt) {
        if (jwt == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        log.info("Public User Favorite API: Get user favorites");
        String keycloakId = jwt.getSubject();
        UUID userId = userService.getProfile(keycloakId).getId();

        List<UserFavoriteResponse> favorites = favoriteService.getUserFavorites(userId)
                .stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(favorites);
    }

    @PostMapping
    public ResponseEntity<UserFavoriteResponse> addFavorite(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody AddFavoriteRequest request) {
        log.info("Public User Favorite API: Add favorite for pet: {}", request.getPetId());
        String keycloakId = jwt.getSubject();
        UUID userId = userService.getProfile(keycloakId).getId();

        var favorite = favoriteService.addFavorite(userId, request.getPetId());
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toResponse(favorite));
    }

    @DeleteMapping("/{petId}")
    public ResponseEntity<MessageResponse> removeFavorite(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID petId) {
        log.info("Public User Favorite API: Remove favorite for pet: {}", petId);
        String keycloakId = jwt.getSubject();
        UUID userId = userService.getProfile(keycloakId).getId();

        favoriteService.removeFavorite(userId, petId);
        return ResponseEntity.ok(MessageResponse.builder()
                .message("Favorite removed successfully")
                .success(true)
                .build());
    }

    @GetMapping("/{petId}/check")
    public ResponseEntity<Boolean> checkFavorite(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID petId) {
        if (jwt == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        log.info("Public User Favorite API: Check if pet is favorite: {}", petId);
        String keycloakId = jwt.getSubject();
        UUID userId = userService.getProfile(keycloakId).getId();

        boolean isFavorite = favoriteService.isFavorite(userId, petId);
        return ResponseEntity.ok(isFavorite);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getFavoriteCount(@AuthenticationPrincipal Jwt jwt) {
        if (jwt == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        log.info("Public User Favorite API: Get favorite count");
        String keycloakId = jwt.getSubject();
        UUID userId = userService.getProfile(keycloakId).getId();

        long count = favoriteService.getFavoriteCount(userId);
        return ResponseEntity.ok(count);
    }
}

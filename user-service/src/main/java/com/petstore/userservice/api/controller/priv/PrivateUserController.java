package com.petstore.userservice.api.controller.priv;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.petstore.userservice.api.dto.request.UpdateUserRequest;
import com.petstore.userservice.api.dto.response.MessageResponse;
import com.petstore.userservice.api.dto.response.UserResponse;
import com.petstore.userservice.api.dto.response.UserStatisticsResponse;
import com.petstore.userservice.domain.model.User;
import com.petstore.userservice.domain.service.UserService;
import com.petstore.userservice.infra.mapper.UserMapper;
import com.petstore.userservice.utils.UserApiPath;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Private User Controller
 * For authenticated user operations and admin operations
 */
@Slf4j
@RestController
@RequestMapping(UserApiPath.PRIVATE_USER_BASE)
@RequiredArgsConstructor
public class PrivateUserController {

    private final UserService userService;
    private final UserMapper userMapper;

    // ==================== USER ENDPOINTS (Authenticated) ====================
    
    /**
     * Get current user's profile
     * Accessible by: Any authenticated user
     */
    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile(@AuthenticationPrincipal Jwt jwt) {
        String keycloakId = jwt.getSubject();
        log.info("Private API: Fetching profile for keycloakId: {}", keycloakId);
        return ResponseEntity.ok(userMapper.toUserDto(userService.getProfile(keycloakId)));
    }

    // ==================== ADMIN ENDPOINTS (ADMIN Role Required) ====================
    
    /**
     * Get all users with pagination
     * Accessible by: ADMIN only
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<UserResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort) {
        
        log.info("Private API: Admin fetching all users - page: {}, size: {}, sort: {}", page, size, sort);
        
        // Parse sort parameter
        String[] sortParams = sort.split(",");
        Sort.Direction direction = sortParams.length > 1 && sortParams[1].equalsIgnoreCase("desc") 
            ? Sort.Direction.DESC 
            : Sort.Direction.ASC;
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortParams[0]));
        Page<User> users = userService.getAllUsers(pageable);
        Page<UserResponse> userResponses = users.map(userMapper::toUserDto);
        
        return ResponseEntity.ok(userResponses);
    }

    /**
     * Get user by ID
     * Accessible by: ADMIN only
     */
    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID userId) {
        log.info("Private API: Admin fetching user by ID: {}", userId);
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(userMapper.toUserDto(user));
    }

    /**
     * Search users by keyword
     * Accessible by: ADMIN only
     */
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<UserResponse>> searchUsers(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        log.info("Private API: Admin searching users with keyword: {}", keyword);
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = userService.searchUsers(keyword, pageable);
        Page<UserResponse> userResponses = users.map(userMapper::toUserDto);
        
        return ResponseEntity.ok(userResponses);
    }

    /**
     * Update user by ID
     * Accessible by: ADMIN only
     */
    @PutMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable UUID userId,
            @Valid @RequestBody UpdateUserRequest request) {
        
        log.info("Private API: Admin updating user ID: {}", userId);
        User user = userService.updateUserById(userId, request);
        return ResponseEntity.ok(userMapper.toUserDto(user));
    }

    /**
     * Delete user by ID
     * Accessible by: ADMIN only
     */
    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deleteUser(@PathVariable UUID userId) {
        log.info("Private API: Admin deleting user ID: {}", userId);
        userService.deleteUser(userId);
        return ResponseEntity.ok(MessageResponse.builder()
                .message("User deleted successfully")
                .success(true)
                .build());
    }

    /**
     * Get user statistics
     * Accessible by: ADMIN only
     */
    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserStatisticsResponse> getUserStatistics() {
        log.info("Private API: Admin fetching user statistics");
        UserStatisticsResponse statistics = userService.getUserStatistics();
        return ResponseEntity.ok(statistics);
    }
}

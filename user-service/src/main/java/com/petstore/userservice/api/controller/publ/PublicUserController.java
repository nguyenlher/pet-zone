package com.petstore.userservice.api.controller.publ;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.petstore.userservice.api.dto.response.UserResponse;
import com.petstore.userservice.api.dto.response.UserStatisticsResponse;
import com.petstore.userservice.domain.model.User;
import com.petstore.userservice.domain.service.UserService;
import com.petstore.userservice.infra.mapper.UserMapper;
import com.petstore.userservice.utils.UserApiPath;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Public User Controller
 * Handles public user endpoints with different authorization levels
 */
@RestController
@RequestMapping(UserApiPath.PUBLIC_USER_BASE)
@RequiredArgsConstructor
@Slf4j
public class PublicUserController {

    private final UserService userService;
    private final UserMapper userMapper;

    /**
     * Get user count (for dashboard)
     * ADMIN only endpoint
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<Map<String, Object>> getUserCount(Pageable pageable) {
        log.info("Admin API: Getting user count");
        Page<?> users = userService.getAllUsers(pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("totalElements", users.getTotalElements());
        response.put("totalPages", users.getTotalPages());
        response.put("size", users.getSize());
        response.put("number", users.getNumber());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get user statistics summary
     * ADMIN only endpoint
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/summary")
    public ResponseEntity<UserStatisticsResponse> getUserStatisticsSummary() {
        log.info("Admin API: Getting user statistics summary");
        return ResponseEntity.ok(userService.getUserStatistics());
    }

    /**
     * Get user by ID
     * Public endpoint - no authentication required
     * Used for displaying customer info in orders, etc.
     */
    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID userId) {
        log.info("Public API: Getting user by id: {}", userId);
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(userMapper.toUserDto(user));
    }

    /**
     * Get all users with pagination
     * ADMIN only endpoint
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<Page<UserResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort) {
        
        log.info("Admin API: Getting all users - page: {}, size: {}, sort: {}", page, size, sort);
        
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
     * Search users by keyword
     * ADMIN only endpoint
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/search")
    public ResponseEntity<Page<UserResponse>> searchUsers(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        log.info("Admin API: Searching users with keyword: {}", keyword);
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = userService.searchUsers(keyword, pageable);
        Page<UserResponse> userResponses = users.map(userMapper::toUserDto);
        
        return ResponseEntity.ok(userResponses);
    }
}

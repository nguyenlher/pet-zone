package com.petstore.userservice.domain.service.impl;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.petstore.userservice.api.dto.request.RegisterRequest;
import com.petstore.userservice.api.dto.request.UpdateUserRequest;
import com.petstore.userservice.api.dto.response.UserStatisticsResponse;
import com.petstore.userservice.domain.model.User;
import com.petstore.userservice.domain.repository.UserRepository;
import com.petstore.userservice.domain.service.KeycloakAuthService;
import com.petstore.userservice.domain.service.UserService;
import com.petstore.userservice.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final KeycloakAuthService keycloakAuthService;

    @Override
    public User createUser(String keycloakId, RegisterRequest request) {
        User user = User.builder()
                .keycloakId(keycloakId)
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);
        log.info("User saved to DB with Keycloak ID: {}", keycloakId);
        return savedUser;
    }

    @Override
    public User updateUser(String keycloakId, UpdateUserRequest request) {
        User user = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with keycloakId: " + keycloakId));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setAvatarUrl(request.getAvatarUrl());
        user.setUpdatedAt(LocalDateTime.now());
        User savedUser = userRepository.save(user);
        log.info("User updated with Keycloak ID: {}", keycloakId);
        return savedUser;
    }

    @Override
    public User getProfile(String keycloakId) {
        User user = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with keycloakId: " + keycloakId));
        return User.builder()
                .id(user.getId())
                .keycloakId(user.getKeycloakId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .avatarUrl(user.getAvatarUrl())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    // ==================== ADMIN OPERATIONS ====================

    @Override
    public Page<User> getAllUsers(Pageable pageable) {
        log.info("Fetching all users with pagination: {}", pageable);
        return userRepository.findAll(pageable);
    }

    @Override
    public User getUserById(UUID userId) {
        log.info("Fetching user by ID: {}", userId);
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
    }

    @Override
    public Page<User> searchUsers(String keyword, Pageable pageable) {
        log.info("Searching users with keyword: {}", keyword);
        return userRepository.searchByKeyword(keyword, pageable);
    }

    @Override
    public User updateUserById(UUID userId, UpdateUserRequest request) {
        log.info("Updating user by ID: {}", userId);
        log.info("Request data - firstName: {}, lastName: {}, avatarUrl: {}, isActive: {}", 
                request.getFirstName(), request.getLastName(), request.getAvatarUrl(), request.getIsActive());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }
        if (request.getIsActive() != null) {
            log.info("Updating isActive from {} to {}", user.getIsActive(), request.getIsActive());
            user.setIsActive(request.getIsActive());
            
            // Sync with Keycloak: update enabled status
            try {
                keycloakAuthService.updateUserEnabledStatus(user.getKeycloakId(), request.getIsActive());
                log.info("Successfully synced isActive status to Keycloak for user: {}", userId);
            } catch (Exception ex) {
                log.error("Failed to sync isActive status to Keycloak for user: {}. Error: {}", userId, ex.getMessage());
                // Continue with database update even if Keycloak sync fails
                // Admin can manually fix Keycloak status later
            }
        }
        user.setUpdatedAt(LocalDateTime.now());
        
        User savedUser = userRepository.save(user);
        log.info("User updated successfully. New isActive: {}", savedUser.getIsActive());
        return savedUser;
    }

    @Override
    public void deleteUser(UUID userId) {
        log.info("Deleting user by ID: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        
        // Delete from Keycloak first
        try {
            keycloakAuthService.deleteUser(user.getKeycloakId());
            log.info("Successfully deleted user from Keycloak: {}", userId);
        } catch (Exception ex) {
            log.error("Failed to delete user from Keycloak: {}. Error: {}", userId, ex.getMessage());
            // If Keycloak deletion fails, we should not proceed with database deletion
            // to maintain consistency between Keycloak and database
            throw ex;
        }
        
        // Delete from database after successful Keycloak deletion
        userRepository.delete(user);
        log.info("User deleted successfully from database: {}", userId);
    }

    @Override
    public UserStatisticsResponse getUserStatistics() {
        log.info("Calculating user statistics");
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfToday = now.toLocalDate().atStartOfDay();
        LocalDateTime startOfWeek = now.minusWeeks(1);
        LocalDateTime startOfMonth = now.minusMonths(1);
        
        Long totalUsers = userRepository.count();
        Long activeUsers = userRepository.countByIsActive(true);
        Long inactiveUsers = userRepository.countByIsActive(false);
        Long newUsersToday = userRepository.countByCreatedAtAfter(startOfToday);
        Long newUsersThisWeek = userRepository.countByCreatedAtAfter(startOfWeek);
        Long newUsersThisMonth = userRepository.countByCreatedAtAfter(startOfMonth);
        
        return UserStatisticsResponse.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .inactiveUsers(inactiveUsers)
                .newUsersToday(newUsersToday)
                .newUsersThisWeek(newUsersThisWeek)
                .newUsersThisMonth(newUsersThisMonth)
                .build();
    }
}

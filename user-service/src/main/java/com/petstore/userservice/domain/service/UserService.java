package com.petstore.userservice.domain.service;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.petstore.userservice.api.dto.request.RegisterRequest;
import com.petstore.userservice.api.dto.request.UpdateUserRequest;
import com.petstore.userservice.api.dto.response.UserStatisticsResponse;
import com.petstore.userservice.domain.model.User;

public interface UserService {
    // User operations
    User createUser(String keycloakId, RegisterRequest request);
    User updateUser(String keycloakId, UpdateUserRequest request);
    User getProfile(String keycloakId);
    
    // Admin operations
    Page<User> getAllUsers(Pageable pageable);
    User getUserById(UUID userId);
    Page<User> searchUsers(String keyword, Pageable pageable);
    User updateUserById(UUID userId, UpdateUserRequest request);
    void deleteUser(UUID userId);
    UserStatisticsResponse getUserStatistics();
}

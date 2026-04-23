package com.petstore.userservice.domain.service;

import com.petstore.userservice.api.dto.request.RegisterRequest;
import com.petstore.userservice.api.dto.request.UpdateUserRequest;
import com.petstore.userservice.api.dto.response.UserResponse;
import com.petstore.userservice.domain.model.User;

public interface UserService {
    User createUser(String keycloakId, RegisterRequest request);
    User updateUser(String keycloakId, UpdateUserRequest request);
    UserResponse getProfile(String keycloakId);
}

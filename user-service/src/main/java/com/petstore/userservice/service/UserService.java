package com.petstore.userservice.service;

import com.petstore.userservice.dto.request.RegisterRequest;
import com.petstore.userservice.model.User;

import java.util.UUID;

public interface UserService {
    User createUser(String keycloakId, RegisterRequest request);
}

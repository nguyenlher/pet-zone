package com.petstore.userservice.service.impl;

import com.petstore.userservice.dto.request.RegisterRequest;
import com.petstore.userservice.dto.request.UpdateUserRequest;
import com.petstore.userservice.model.User;
import com.petstore.userservice.repository.UserRepository;
import com.petstore.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

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
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setAvatarUrl(request.getAvatarUrl());
        user.setUpdatedAt(LocalDateTime.now());
        User savedUser = userRepository.save(user);
        log.info("User updated with Keycloak ID: {}", keycloakId);
        return savedUser;
    }
}

package com.petstore.userservice.service.impl;

import com.petstore.userservice.dto.request.RegisterRequest;
import com.petstore.userservice.model.User;
import com.petstore.userservice.repository.UserRepository;
import com.petstore.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

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

        userRepository.save(user);
        log.info("User saved to DB with Keycloak ID: {}", keycloakId);
        return user;
    }
}

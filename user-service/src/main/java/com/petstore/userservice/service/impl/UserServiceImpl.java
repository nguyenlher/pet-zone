package com.petstore.userservice.service.impl;

import com.petstore.userservice.dto.request.RegisterRequest;
import com.petstore.userservice.model.UserFavorite;
import com.petstore.userservice.repository.UserFavoriteRepository;
import com.petstore.userservice.repository.UserRepository;
import com.petstore.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.petstore.userservice.model.User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserFavoriteRepository userFavoriteRepository;

    @Override
    public void createUser(String keycloakId, RegisterRequest request) {
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
    }

    @Override
    public void addToFavorite(UUID userId, UUID petId) {
        UserFavorite userFavorite = UserFavorite.builder()
                .userId(userId)
                .petId(petId)
                .createdAt(LocalDateTime.now())
                .build();
        userFavoriteRepository.save(userFavorite);
        log.info("Added pet {} to user {}'s favorites", petId, userId);
    }
}

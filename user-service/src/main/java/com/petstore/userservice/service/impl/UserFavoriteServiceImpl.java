package com.petstore.userservice.service.impl;

import com.petstore.userservice.dto.response.MessageResponse;
import com.petstore.userservice.model.UserFavorite;
import com.petstore.userservice.repository.UserFavoriteRepository;
import com.petstore.userservice.repository.jpa.JpaUserFavoriteRepository;
import com.petstore.userservice.service.UserFavoriteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserFavoriteServiceImpl implements UserFavoriteService {
    private final UserFavoriteRepository userFavoriteRepository;
    private final JpaUserFavoriteRepository jpaUserFavoriteRepository;

    @Override
    public UserFavorite addFavorite(UUID userId, UUID petId) {
        UserFavorite userFavorite = UserFavorite.builder()
                .userId(userId)
                .petId(petId)
                .createdAt(LocalDateTime.now())
                .build();

        log.info("Added pet {} to user {}'s favorites", petId, userId);
        return userFavoriteRepository.save(userFavorite);
    }

    @Override
    public void removeFavorite(UUID userId, UUID petId) {
        UserFavorite userFavorite = userFavoriteRepository.findByUserIdAndPetId(userId, petId)
                .orElseThrow(() -> new RuntimeException("Favorite not found for User ID: " + userId + " and Pet ID: " + petId));

        log.info("Removing pet {} from user {}'s favorites", petId, userId);
        userFavoriteRepository.deleteByUserIdAndPetId(userId, petId);
    }
}

package com.petstore.userservice.domain.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.petstore.userservice.domain.model.UserFavorite;
import com.petstore.userservice.domain.repository.UserFavoriteRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserFavoriteService {

    private final UserFavoriteRepository favoriteRepository;

    @Transactional
    public UserFavorite addFavorite(UUID userId, UUID petId) {
        log.info("Adding favorite for user: {} and pet: {}", userId, petId);
        
        // Check if already exists
        if (favoriteRepository.existsByUserIdAndPetId(userId, petId)) {
            log.warn("Favorite already exists for user: {} and pet: {}", userId, petId);
            throw new IllegalArgumentException("Pet is already in favorites");
        }

        UserFavorite favorite = UserFavorite.builder()
                .userId(userId)
                .petId(petId)
                .build();

        return favoriteRepository.save(favorite);
    }

    @Transactional
    public void removeFavorite(UUID userId, UUID petId) {
        log.info("Removing favorite for user: {} and pet: {}", userId, petId);
        
        if (!favoriteRepository.existsByUserIdAndPetId(userId, petId)) {
            log.warn("Favorite not found for user: {} and pet: {}", userId, petId);
            throw new IllegalArgumentException("Favorite not found");
        }

        favoriteRepository.deleteByUserIdAndPetId(userId, petId);
    }

    @Transactional(readOnly = true)
    public List<UserFavorite> getUserFavorites(UUID userId) {
        log.info("Getting favorites for user: {}", userId);
        return favoriteRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public boolean isFavorite(UUID userId, UUID petId) {
        return favoriteRepository.existsByUserIdAndPetId(userId, petId);
    }

    @Transactional(readOnly = true)
    public long getFavoriteCount(UUID userId) {
        return favoriteRepository.countByUserId(userId);
    }
}

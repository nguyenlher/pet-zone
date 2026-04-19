package com.petstore.userservice.domain.service;

import com.petstore.userservice.domain.model.UserFavorite;

import java.util.UUID;

public interface UserFavoriteService {
    UserFavorite addFavorite(UUID userId, UUID petId);
    void removeFavorite(UUID userId, UUID petId);
}

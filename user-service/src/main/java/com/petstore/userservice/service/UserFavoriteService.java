package com.petstore.userservice.service;

import com.petstore.userservice.model.UserFavorite;

import java.util.UUID;

public interface UserFavoriteService {
    UserFavorite addFavorite(UUID userId, UUID petId);
    void removeFavorite(UUID userId, UUID petId);
}

package com.petstore.userservice.domain.repository;

import com.petstore.userservice.domain.model.UserFavorite;

import java.util.Optional;
import java.util.UUID;

public interface UserFavoriteRepository {
    UserFavorite save(UserFavorite userFavorite);
    Optional<UserFavorite> findByUserIdAndPetId(UUID userId, UUID petId);
    void deleteByUserIdAndPetId(UUID userId, UUID petId);
}

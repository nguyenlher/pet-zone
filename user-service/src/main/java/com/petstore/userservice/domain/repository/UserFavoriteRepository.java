package com.petstore.userservice.domain.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.petstore.userservice.domain.model.UserFavorite;

public interface UserFavoriteRepository {
    
    UserFavorite save(UserFavorite favorite);
    
    List<UserFavorite> findByUserId(UUID userId);
    
    Optional<UserFavorite> findByUserIdAndPetId(UUID userId, UUID petId);
    
    boolean existsByUserIdAndPetId(UUID userId, UUID petId);
    
    void deleteByUserIdAndPetId(UUID userId, UUID petId);
    
    long countByUserId(UUID userId);
}

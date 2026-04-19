package com.petstore.userservice.infra.repository.jpa;

import com.petstore.userservice.infra.entity.UserFavoriteEnity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface JpaUserFavoriteRepository extends JpaRepository<UserFavoriteEnity, UUID> {
    Optional<UserFavoriteEnity> findByUserIdAndPetId(UUID userId, UUID petId);
    void deleteByUserIdAndPetId(UUID userId, UUID petId);
}

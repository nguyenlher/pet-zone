package com.petstore.userservice.infra.repository.jpa;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.petstore.userservice.infra.entity.UserFavoriteEntity;

@Repository
public interface JpaUserFavoriteRepository extends JpaRepository<UserFavoriteEntity, UUID> {
    
    List<UserFavoriteEntity> findByUserIdOrderByCreatedAtDesc(UUID userId);
    
    Optional<UserFavoriteEntity> findByUserIdAndPetId(UUID userId, UUID petId);
    
    boolean existsByUserIdAndPetId(UUID userId, UUID petId);
    
    void deleteByUserIdAndPetId(UUID userId, UUID petId);
    
    long countByUserId(UUID userId);
}

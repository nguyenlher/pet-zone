package com.petstore.userservice.infra.repository.jpa;

import com.petstore.userservice.infra.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface JpaUserRepository extends JpaRepository<UserEntity, UUID> {
    Optional<UserEntity> findByEmail(String email);
    Optional<UserEntity> findByKeycloakId(String keycloakId);
}

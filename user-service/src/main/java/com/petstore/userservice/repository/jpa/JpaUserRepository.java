package com.petstore.userservice.repository.jpa;

import java.util.Optional;
import java.util.UUID;

import com.petstore.userservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import com.petstore.userservice.entity.UserEntity;

public interface JpaUserRepository extends JpaRepository<UserEntity, UUID> {
    Optional<UserEntity> findByEmail(String email);
}

package com.petstore.userservice.repository;

import com.petstore.userservice.model.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository {
    User save(User user);
    Optional<User> findById(UUID id);
    Optional<User> findByEmail(String email);
    Optional<User> findByKeycloakId(String keycloakId);
    List<User> findAll();
}

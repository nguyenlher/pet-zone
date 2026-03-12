package com.petstore.userservice.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.petstore.userservice.model.User;

public interface UserRepository {
    User save(User user);
    Optional<User> findById(UUID id);
    Optional<User> findByEmail(String email);
    List<User> findAll();
}

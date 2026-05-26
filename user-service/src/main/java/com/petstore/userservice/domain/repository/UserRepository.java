package com.petstore.userservice.domain.repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.petstore.userservice.domain.model.User;

public interface UserRepository {
    User save(User user);
    Optional<User> findById(UUID id);
    Optional<User> findByEmail(String email);
    Optional<User> findByKeycloakId(String keycloakId);
    Page<User> findAll(Pageable pageable);
    Page<User> searchByKeyword(String keyword, Pageable pageable);
    void delete(User user);
    Long count();
    Long countByIsActive(Boolean isActive);
    Long countByCreatedAtAfter(LocalDateTime dateTime);
}

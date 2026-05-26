package com.petstore.userservice.infra.repository.impl;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.petstore.userservice.domain.model.User;
import com.petstore.userservice.domain.repository.UserRepository;
import com.petstore.userservice.infra.entity.UserEntity;
import com.petstore.userservice.infra.mapper.UserMapper;
import com.petstore.userservice.infra.repository.jpa.JpaUserRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepository {
    private final JpaUserRepository jpaUserRepository;
    private final UserMapper mapper;

    @Override
    public User save(User user) {
        UserEntity entity = mapper.toEntity(user);
        UserEntity savedEntity = jpaUserRepository.save(entity);
        return mapper.toDomain(savedEntity);
    }

    @Override
    public Optional<User> findById(UUID id) {
        Optional<UserEntity> entityOpt = jpaUserRepository.findById(id);
        return entityOpt.map(mapper::toDomain);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        Optional<UserEntity> entityOpt = jpaUserRepository.findByEmail(email);
        return entityOpt.map(mapper::toDomain);
    }

    @Override
    public Optional<User> findByKeycloakId(String keycloakId) {
        Optional<UserEntity> entityOpt = jpaUserRepository.findByKeycloakId(keycloakId);
        return entityOpt.map(mapper::toDomain);
    }

    @Override
    public Page<User> findAll(Pageable pageable) {
        Page<UserEntity> entities = jpaUserRepository.findAll(pageable);
        return entities.map(mapper::toDomain);
    }

    @Override
    public Page<User> searchByKeyword(String keyword, Pageable pageable) {
        Page<UserEntity> entities = jpaUserRepository.searchByKeyword(keyword, pageable);
        return entities.map(mapper::toDomain);
    }

    @Override
    public void delete(User user) {
        UserEntity entity = mapper.toEntity(user);
        jpaUserRepository.delete(entity);
    }

    @Override
    public Long count() {
        return jpaUserRepository.count();
    }

    @Override
    public Long countByIsActive(Boolean isActive) {
        return jpaUserRepository.countByIsActive(isActive);
    }

    @Override
    public Long countByCreatedAtAfter(LocalDateTime dateTime) {
        return jpaUserRepository.countByCreatedAtAfter(dateTime);
    }
}

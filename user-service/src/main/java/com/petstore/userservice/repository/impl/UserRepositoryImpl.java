package com.petstore.userservice.repository.impl;

import org.springframework.stereotype.Repository;

import com.petstore.userservice.entity.UserEntity;
import com.petstore.userservice.mapper.UserMapper;
import com.petstore.userservice.model.User;
import com.petstore.userservice.repository.UserRepository;
import com.petstore.userservice.repository.jpa.JpaUserRepository;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepository {
    private final JpaUserRepository jpaUserRepository;
    private final UserMapper mapper;

    @Override
    public void save(User user) {
        UserEntity entity = mapper.toEntity(user);
        UserEntity savedEntity = jpaUserRepository.save(entity);
        mapper.toDomain(savedEntity);
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
     public List<User> findAll() {
        List<UserEntity> entities = jpaUserRepository.findAll();
        return mapper.toDomain(entities);
     }
}

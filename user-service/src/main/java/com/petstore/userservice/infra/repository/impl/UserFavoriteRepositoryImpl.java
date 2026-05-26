package com.petstore.userservice.infra.repository.impl;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.petstore.userservice.domain.model.UserFavorite;
import com.petstore.userservice.domain.repository.UserFavoriteRepository;
import com.petstore.userservice.infra.mapper.UserFavoriteMapper;
import com.petstore.userservice.infra.repository.jpa.JpaUserFavoriteRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class UserFavoriteRepositoryImpl implements UserFavoriteRepository {

    private final JpaUserFavoriteRepository jpaRepository;
    private final UserFavoriteMapper mapper;

    @Override
    @Transactional
    public UserFavorite save(UserFavorite favorite) {
        var entity = mapper.toEntity(favorite);
        var saved = jpaRepository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserFavorite> findByUserId(UUID userId) {
        return jpaRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserFavorite> findByUserIdAndPetId(UUID userId, UUID petId) {
        return jpaRepository.findByUserIdAndPetId(userId, petId)
                .map(mapper::toDomain);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByUserIdAndPetId(UUID userId, UUID petId) {
        return jpaRepository.existsByUserIdAndPetId(userId, petId);
    }

    @Override
    @Transactional
    public void deleteByUserIdAndPetId(UUID userId, UUID petId) {
        jpaRepository.deleteByUserIdAndPetId(userId, petId);
    }

    @Override
    @Transactional(readOnly = true)
    public long countByUserId(UUID userId) {
        return jpaRepository.countByUserId(userId);
    }
}

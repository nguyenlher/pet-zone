package com.petstore.userservice.repository.impl;

import com.petstore.userservice.entity.UserFavoriteEnity;
import com.petstore.userservice.mapper.UserFavoriteMapper;
import com.petstore.userservice.model.UserFavorite;
import com.petstore.userservice.repository.UserFavoriteRepository;
import com.petstore.userservice.repository.jpa.JpaUserFavoriteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class UserFavoriteRepositoryImpl implements UserFavoriteRepository {
    private final JpaUserFavoriteRepository jpaUserFavoriteRepository;
    private final UserFavoriteMapper mapper;

    @Override
    public UserFavorite save(UserFavorite userFavorite) {
        UserFavoriteEnity entity = mapper.toEntity(userFavorite);
        UserFavoriteEnity savedEntity = jpaUserFavoriteRepository.save(entity);
        return mapper.toDomain(savedEntity);
    }

    @Override
    public Optional<UserFavorite> findByUserIdAndPetId(UUID userId, UUID petId) {
        return jpaUserFavoriteRepository.findByUserIdAndPetId(userId, petId)
                .map(mapper::toDomain);
    }

    @Override
    public void deleteByUserIdAndPetId(UUID userId, UUID petId) {
        jpaUserFavoriteRepository.deleteByUserIdAndPetId(userId, petId);
    }
}

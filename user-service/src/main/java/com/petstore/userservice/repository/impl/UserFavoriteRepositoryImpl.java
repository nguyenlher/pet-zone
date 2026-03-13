package com.petstore.userservice.repository.impl;

import com.petstore.userservice.entity.UserFavoriteEnity;
import com.petstore.userservice.mapper.UserFavoriteMapper;
import com.petstore.userservice.model.UserFavorite;
import com.petstore.userservice.repository.UserFavoriteRepository;
import com.petstore.userservice.repository.jpa.JpaUserFavoriteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class UserFavoriteRepositoryImpl implements UserFavoriteRepository {
    private final JpaUserFavoriteRepository jpaUserFavoriteRepository;
    private final UserFavoriteMapper mapper;

    @Override
    public void save(UserFavorite userFavorite) {
        UserFavoriteEnity entity = mapper.toEntity(userFavorite);
        UserFavoriteEnity savedEntity = jpaUserFavoriteRepository.save(entity);
        mapper.toDomain(savedEntity);
    }
}

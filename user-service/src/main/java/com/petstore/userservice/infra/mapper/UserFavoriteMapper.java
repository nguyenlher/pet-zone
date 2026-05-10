package com.petstore.userservice.infra.mapper;

import org.springframework.stereotype.Component;

import com.petstore.userservice.api.dto.response.UserFavoriteResponse;
import com.petstore.userservice.domain.model.UserFavorite;
import com.petstore.userservice.infra.entity.UserFavoriteEntity;

@Component
public class UserFavoriteMapper {

    public UserFavorite toDomain(UserFavoriteEntity entity) {
        if (entity == null) {
            return null;
        }
        return UserFavorite.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .petId(entity.getPetId())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public UserFavoriteEntity toEntity(UserFavorite domain) {
        if (domain == null) {
            return null;
        }
        return UserFavoriteEntity.builder()
                .id(domain.getId())
                .userId(domain.getUserId())
                .petId(domain.getPetId())
                .createdAt(domain.getCreatedAt())
                .build();
    }

    public UserFavoriteResponse toResponse(UserFavorite domain) {
        if (domain == null) {
            return null;
        }
        return UserFavoriteResponse.builder()
                .id(domain.getId())
                .userId(domain.getUserId())
                .petId(domain.getPetId())
                .createdAt(domain.getCreatedAt())
                .build();
    }
}

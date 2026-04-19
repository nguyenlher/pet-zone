package com.petstore.userservice.infra.mapper;

import com.petstore.userservice.infra.entity.UserFavoriteEnity;
import com.petstore.userservice.domain.model.UserFavorite;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserFavoriteMapper {
    UserFavoriteEnity toEntity (UserFavorite userFavorite);
    UserFavorite toDomain (UserFavoriteEnity entity);
    List<UserFavoriteEnity> toEntity (List<UserFavorite> userFavorites);
    List<UserFavorite> toDomain (List<UserFavoriteEnity> entities);
}

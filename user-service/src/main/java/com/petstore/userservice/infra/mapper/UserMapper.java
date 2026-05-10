package com.petstore.userservice.infra.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

import com.petstore.userservice.api.dto.response.UserResponse;
import com.petstore.userservice.domain.model.User;
import com.petstore.userservice.infra.entity.UserEntity;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface UserMapper {
    UserEntity toEntity(User user);

    User toDomain(UserEntity entity);

    List<UserEntity> toEntity(List<User> users);

    List<User> toDomain(List<UserEntity> entities);

    UserResponse toUserDto(User user);
}

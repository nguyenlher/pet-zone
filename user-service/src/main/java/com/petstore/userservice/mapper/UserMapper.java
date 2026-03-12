package com.petstore.userservice.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.petstore.userservice.entity.UserEntity;
import com.petstore.userservice.model.User;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserMapper {
    UserEntity toEntity(User user);

    User toDomain(UserEntity entity);

    List<UserEntity> toEntity(List<User> users);

    List<User> toDomain(List<UserEntity> entities);
}

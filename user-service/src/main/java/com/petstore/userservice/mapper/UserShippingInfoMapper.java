package com.petstore.userservice.mapper;

import com.petstore.userservice.entity.UserShippingInfoEntity;
import com.petstore.userservice.model.UserShippingInfo;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserShippingInfoMapper {
    UserShippingInfoEntity toEntity(UserShippingInfo userShippingInfo);
    UserShippingInfo toDomain(UserShippingInfoEntity entity);
    List<UserShippingInfoEntity> toEntity(List<UserShippingInfo> userShippingInfos);
    List<UserShippingInfo> toDomain(List<UserShippingInfoEntity> entities);
}

package com.petstore.petservice.infra.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.petstore.petservice.domain.model.PetProductImage;
import com.petstore.petservice.infra.entity.PetProductImageEntity;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface PetProductImageMapper {
    PetProductImageEntity toEntity(PetProductImage image);
    PetProductImage toDomain(PetProductImageEntity entity);
    List<PetProductImageEntity> toEntityList(List<PetProductImage> images);
    List<PetProductImage> toDomainList(List<PetProductImageEntity> entities);
}

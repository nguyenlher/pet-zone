package com.petstore.petservice.infra.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.petstore.petservice.infra.entity.Pet3DModelEntity;
import com.petstore.petservice.domain.model.Pet3DModel;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface Pet3DModelMapper {
    Pet3DModelEntity toEntity(Pet3DModel model);
    Pet3DModel toDomain(Pet3DModelEntity entity);
    List<Pet3DModelEntity> toEntityList(List<Pet3DModel> models);
    List<Pet3DModel> toDomainList(List<Pet3DModelEntity> entities);
}

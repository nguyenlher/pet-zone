package com.petstore.petservice.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.petstore.petservice.dto.response.PetTypeResponse;
import com.petstore.petservice.entity.PetTypeEntity;
import com.petstore.petservice.model.PetType;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface PetTypeMapper {
    PetTypeEntity toEntity(PetType petType);
    PetType toDomain(PetTypeEntity entity);
    List<PetTypeEntity> toEntityList(List<PetType> petTypes);
    List<PetType> toDomainList(List<PetTypeEntity> entities);
    PetTypeResponse toResponse(PetType petType);
}

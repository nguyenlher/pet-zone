package com.petstore.petservice.mapper;

import com.petstore.petservice.entity.BreedEntity;
import com.petstore.petservice.model.Breed;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface BreedMapper {
    BreedEntity toEntity(Breed breed);
    Breed toDomain(BreedEntity entity);
    List<BreedEntity> toEntityList(List<Breed> breeds);
    List<Breed> toDomainList(List<BreedEntity> entities);
}
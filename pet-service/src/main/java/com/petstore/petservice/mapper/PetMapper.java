package com.petstore.petservice.mapper;

import com.petstore.petservice.entity.PetEntity;
import com.petstore.petservice.model.Pet;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface PetMapper {
    PetEntity toEntity(Pet pet);
    Pet toDomain(PetEntity entity);
    List<PetEntity> toEntity(List<Pet> pets);
    List<Pet> toDomain(List<PetEntity> entities);
}

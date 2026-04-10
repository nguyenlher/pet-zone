package com.petstore.petservice.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.petstore.petservice.entity.PetImageEntity;
import com.petstore.petservice.model.PetImage;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface PetImageMapper {
    @Mapping(target = "pet", ignore = true)
    PetImageEntity toEntity(PetImage petImage);
    
    PetImage toDomain(PetImageEntity entity);
    
    List<PetImageEntity> toEntityList(List<PetImage> petImages);
    List<PetImage> toDomainList(List<PetImageEntity> entities);
}

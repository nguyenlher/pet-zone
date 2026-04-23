package com.petstore.petservice.infra.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.petstore.petservice.domain.model.PetImage;
import com.petstore.petservice.infra.entity.PetImageEntity;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface PetImageMapper {
    @Mapping(target = "pet", ignore = true)
    PetImageEntity toEntity(PetImage petImage);
    
    @Mapping(target = "petId", expression = "java(entity.getPet() != null ? entity.getPet().getId() : null)")
    PetImage toDomain(PetImageEntity entity);
    
    List<PetImageEntity> toEntityList(List<PetImage> petImages);
    List<PetImage> toDomainList(List<PetImageEntity> entities);
}

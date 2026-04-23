package com.petstore.petservice.infra.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.petstore.petservice.domain.model.Pet3DModel;
import com.petstore.petservice.infra.entity.Pet3DModelEntity;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface Pet3DModelMapper {
    @Mapping(target = "pet", ignore = true)
    Pet3DModelEntity toEntity(Pet3DModel model);
    
    @Mapping(target = "petId", expression = "java(entity.getPet() != null ? entity.getPet().getId() : null)")
    Pet3DModel toDomain(Pet3DModelEntity entity);
    
    List<Pet3DModelEntity> toEntityList(List<Pet3DModel> models);
    List<Pet3DModel> toDomainList(List<Pet3DModelEntity> entities);
}

package com.petstore.petservice.infra.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.petstore.petservice.api.dto.request.BreedCreateRequest;
import com.petstore.petservice.api.dto.request.BreedUpdateRequest;
import com.petstore.petservice.api.dto.response.BreedResponse;
import com.petstore.petservice.domain.model.Breed;
import com.petstore.petservice.infra.entity.BreedEntity;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface BreedMapper {
    BreedEntity toEntity(Breed breed);
    Breed toDomain(BreedEntity entity);
    List<BreedEntity> toEntityList(List<Breed> breeds);
    List<Breed> toDomainList(List<BreedEntity> entities);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "avgRating", ignore = true)
    @Mapping(target = "totalReviews", ignore = true)
    @Mapping(target = "isActive", constant = "true")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Breed toDomain(BreedCreateRequest request);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "petTypeId", ignore = true)
    @Mapping(target = "avgRating", ignore = true)
    @Mapping(target = "totalReviews", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateDomain(@MappingTarget Breed breed, BreedUpdateRequest request);
    
    @Mapping(target = "petTypeName", ignore = true)
    BreedResponse toResponse(Breed breed);
}
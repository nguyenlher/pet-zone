package com.petstore.petservice.infra.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.petstore.petservice.api.dto.request.CreatePetProductRequest;
import com.petstore.petservice.api.dto.request.UpdatePetProductRequest;
import com.petstore.petservice.api.dto.response.PetProductResponse;
import com.petstore.petservice.domain.model.PetProduct;
import com.petstore.petservice.infra.entity.PetProductEntity;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {PetProductImageMapper.class})
public interface PetProductMapper {
    
    PetProductEntity toEntity(PetProduct petProduct);
    
    PetProduct toDomain(PetProductEntity entity);
    
    List<PetProductEntity> toEntityList(List<PetProduct> petProducts);
    
    List<PetProduct> toDomainList(List<PetProductEntity> entities);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "soldCount", constant = "0")
    @Mapping(target = "avgRating", constant = "0.0")
    @Mapping(target = "totalReviews", constant = "0")
    @Mapping(target = "viewCount", constant = "0")
    @Mapping(target = "images", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    PetProduct toDomain(CreatePetProductRequest request);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "soldCount", ignore = true)
    @Mapping(target = "avgRating", ignore = true)
    @Mapping(target = "totalReviews", ignore = true)
    @Mapping(target = "viewCount", ignore = true)
    @Mapping(target = "images", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateDomain(@MappingTarget PetProduct petProduct, UpdatePetProductRequest request);
    
    PetProductResponse toResponse(PetProduct petProduct);
    
    List<PetProductResponse> toResponseList(List<PetProduct> petProducts);
}

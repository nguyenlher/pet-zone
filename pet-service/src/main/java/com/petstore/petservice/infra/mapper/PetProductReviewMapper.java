package com.petstore.petservice.infra.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.petstore.petservice.domain.model.PetProductReview;
import com.petstore.petservice.infra.entity.PetProductReviewEntity;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface PetProductReviewMapper {
    PetProductReviewEntity toEntity(PetProductReview review);
    PetProductReview toDomain(PetProductReviewEntity entity);
    List<PetProductReviewEntity> toEntityList(List<PetProductReview> reviews);
    List<PetProductReview> toDomainList(List<PetProductReviewEntity> entities);
}

package com.petstore.petservice.infra.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.petstore.petservice.domain.model.Review;
import com.petstore.petservice.infra.entity.ReviewEntity;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ReviewMapper {
    ReviewEntity toEntity(Review review);
    Review toDomain(ReviewEntity entity);
    List<ReviewEntity> toEntityList(List<Review> reviews);
    List<Review> toDomainList(List<ReviewEntity> entities);
}

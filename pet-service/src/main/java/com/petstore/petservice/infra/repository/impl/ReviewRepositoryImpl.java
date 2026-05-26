package com.petstore.petservice.infra.repository.impl;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Repository;

import com.petstore.petservice.domain.model.Review;
import com.petstore.petservice.domain.model.enums.EntityType;
import com.petstore.petservice.domain.repository.ReviewRepository;
import com.petstore.petservice.infra.mapper.ReviewMapper;
import com.petstore.petservice.infra.repository.jpa.JpaReviewRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class ReviewRepositoryImpl implements ReviewRepository {

    private final JpaReviewRepository jpaRepository;
    private final ReviewMapper mapper;

    @Override
    public List<Review> findByEntityTypeAndEntityId(EntityType entityType, UUID entityId) {
        return mapper.toDomainList(jpaRepository.findByEntityTypeAndEntityId(entityType, entityId));
    }

    @Override
    public Optional<Review> findByEntityTypeAndEntityIdAndUserId(
            EntityType entityType, UUID entityId, UUID userId) {
        return jpaRepository.findByEntityTypeAndEntityIdAndUserId(entityType, entityId, userId)
                .map(mapper::toDomain);
    }

    @Override
    public Review save(Review review) {
        return mapper.toDomain(jpaRepository.save(mapper.toEntity(review)));
    }

    @Override
    public void delete(UUID id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public Double getAverageRating(EntityType entityType, UUID entityId) {
        Double avg = jpaRepository.getAverageRating(entityType, entityId);
        return avg != null ? avg : 0.0;
    }

    @Override
    public Long countReviews(EntityType entityType, UUID entityId) {
        return jpaRepository.countReviews(entityType, entityId);
    }
}

package com.petstore.petservice.infra.repository.impl;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Repository;

import com.petstore.petservice.domain.model.PetProductReview;
import com.petstore.petservice.domain.model.enums.EntityType;
import com.petstore.petservice.domain.repository.PetProductReviewRepository;
import com.petstore.petservice.infra.mapper.PetProductReviewMapper;
import com.petstore.petservice.infra.repository.jpa.JpaPetProductReviewRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class PetProductReviewRepositoryImpl implements PetProductReviewRepository {

    private final JpaPetProductReviewRepository jpaRepository;
    private final PetProductReviewMapper mapper;

    @Override
    public List<PetProductReview> findByEntityTypeAndEntityId(EntityType entityType, UUID entityId) {
        return mapper.toDomainList(jpaRepository.findByEntityTypeAndEntityId(entityType, entityId));
    }

    @Override
    public Optional<PetProductReview> findByEntityTypeAndEntityIdAndCustomerId(
            EntityType entityType, UUID entityId, UUID customerId) {
        return jpaRepository.findByEntityTypeAndEntityIdAndCustomerId(entityType, entityId, customerId)
                .map(mapper::toDomain);
    }

    @Override
    public PetProductReview save(PetProductReview review) {
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

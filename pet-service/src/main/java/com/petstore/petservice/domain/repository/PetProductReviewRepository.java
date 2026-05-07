package com.petstore.petservice.domain.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.petstore.petservice.domain.model.PetProductReview;
import com.petstore.petservice.domain.model.enums.EntityType;

public interface PetProductReviewRepository {
    List<PetProductReview> findByEntityTypeAndEntityId(EntityType entityType, UUID entityId);
    Optional<PetProductReview> findByEntityTypeAndEntityIdAndCustomerId(EntityType entityType, UUID entityId, UUID customerId);
    PetProductReview save(PetProductReview review);
    void delete(UUID id);
    Double getAverageRating(EntityType entityType, UUID entityId);
    Long countReviews(EntityType entityType, UUID entityId);
}

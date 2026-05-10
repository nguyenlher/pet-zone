package com.petstore.petservice.domain.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.petstore.petservice.domain.model.Review;
import com.petstore.petservice.domain.model.enums.EntityType;

public interface ReviewRepository {
    List<Review> findByEntityTypeAndEntityId(EntityType entityType, UUID entityId);
    Optional<Review> findByEntityTypeAndEntityIdAndUserId(EntityType entityType, UUID entityId, UUID userId);
    Review save(Review review);
    void delete(UUID id);
    Double getAverageRating(EntityType entityType, UUID entityId);
    Long countReviews(EntityType entityType, UUID entityId);
}

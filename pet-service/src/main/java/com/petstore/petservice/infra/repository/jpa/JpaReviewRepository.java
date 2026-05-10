package com.petstore.petservice.infra.repository.jpa;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.petstore.petservice.domain.model.enums.EntityType;
import com.petstore.petservice.infra.entity.ReviewEntity;

@Repository
public interface JpaReviewRepository extends JpaRepository<ReviewEntity, UUID> {
    List<ReviewEntity> findByEntityTypeAndEntityId(EntityType entityType, UUID entityId);
    
    Optional<ReviewEntity> findByEntityTypeAndEntityIdAndUserId(
        EntityType entityType, UUID entityId, UUID userId
    );
    
    @Query("SELECT AVG(r.rating) FROM ReviewEntity r WHERE r.entityType = :entityType AND r.entityId = :entityId")
    Double getAverageRating(@Param("entityType") EntityType entityType, @Param("entityId") UUID entityId);
    
    @Query("SELECT COUNT(r) FROM ReviewEntity r WHERE r.entityType = :entityType AND r.entityId = :entityId")
    Long countReviews(@Param("entityType") EntityType entityType, @Param("entityId") UUID entityId);
}

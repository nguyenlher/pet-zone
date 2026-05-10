package com.petstore.petservice.infra.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import com.petstore.petservice.domain.model.enums.EntityType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@Builder
@Table(name = "reviews")
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class ReviewEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    UUID id;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "entity_type", nullable = false)
    EntityType entityType;
    
    @Column(name = "entity_id", nullable = false)
    UUID entityId;
    
    @Column(name = "user_id", nullable = false)
    UUID userId;
    
    @Column(name = "rating", nullable = false)
    Integer rating;
    
    @Column(name = "comment", columnDefinition = "TEXT")
    String comment;
    
    @Column(name = "is_verified_purchase")
    @Builder.Default
    Boolean isVerifiedPurchase = false;
    
    @Column(name = "likes")
    @Builder.Default
    Integer likes = 0;
    
    @Column(name = "created_at")
    LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

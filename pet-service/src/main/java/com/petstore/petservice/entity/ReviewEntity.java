package com.petstore.petservice.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "breed_reviews", indexes = {
        @Index(name = "idx_reviews_breed", columnList = "breed_id"),
        @Index(name = "idx_reviews_user", columnList = "user_id")
})
@Data
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class ReviewEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(name = "breed_id", nullable = false)
    UUID breedId;

    @Column(name = "user_id", nullable = false)
    UUID userId;

    @Column(nullable = false)
    Integer rating; // 1-5 sao

    @Column(length = 1000)
    String comment;

    @Column(name = "rating_friendly")
    Integer ratingFriendly; // Thân thiện 

    @Column(name = "rating_health")
    Integer ratingHealth; // Sức khỏe tốt

    @Column(name = "rating_train")
    Integer ratingTrain; // Dễ huấn luyện

    @Column(name = "rating_kids")
    Integer ratingKids; // Tốt với trẻ em

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
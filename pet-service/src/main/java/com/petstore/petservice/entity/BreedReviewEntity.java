package com.petstore.petservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "breed_reviews", 
       uniqueConstraints = {
           @UniqueConstraint(name = "uk_review_breed_user", 
                            columnNames = {"breed_id", "user_id"})
       },
       indexes = {
           @Index(name = "idx_reviews_breed", columnList = "breed_id"),
           @Index(name = "idx_reviews_user", columnList = "user_id")
       })
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class BreedReviewEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(name = "breed_id", nullable = false)
    UUID breedId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "breed_id", insertable = false, updatable = false)
    BreedEntity breed;

    @Column(name = "user_id", nullable = false)
    UUID userId;

    @Min(value = 1, message = "Rating thấp nhất là 1")
    @Max(value = 5, message = "Rating cao nhất là 5")
    @Column(nullable = false)
    Integer rating;

    @Column(length = 1000)
    String comment;

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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof BreedReviewEntity)) return false;
        BreedReviewEntity that = (BreedReviewEntity) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
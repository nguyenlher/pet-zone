package com.petstore.petservice.entity;

import com.petstore.petservice.enums.*;
import jakarta.persistence.*;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "breeds", indexes = {
        @Index(name = "idx_breeds_pet_type", columnList = "pet_type"),
        @Index(name = "idx_breeds_name", columnList = "name")
})
@Data
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class BreedEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(nullable = false)
    String name; // "Chó Phốc", "Mèo Ba Tư"

    @Enumerated(EnumType.STRING)
    @Column(name = "pet_type", nullable = false)
    PetType petType;

    @Column(length = 2000)
    String description; // Mô tả về giống

    // === REVIEW STATS (TỔNG HỢP TỪ BẢNG REVIEW) ===
    @Column(name = "avg_rating")
    Double avgRating = 0.0;

    @Column(name = "total_reviews")
    Integer totalReviews = 0;

    // === MEDIA ===
    @Column(name = "image_url")
    String imageUrl; // Ảnh đại diện giống

    // === STATUS ===
    @Column(name = "is_active")
    Boolean isActive = true;

    // === RELATIONSHIPS ===
    @OneToMany(mappedBy = "breed", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    List<BreedReviewEntity> reviews = new ArrayList<>();

    // === AUDIT ===
    @Column(name = "created_at")
    LocalDateTime createdAt;

    @Column(name = "updated_at")
    LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (totalReviews == null) totalReviews = 0;
        if (avgRating == null) avgRating = 0.0;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void updateReviewStats(Double newAvgRating, Integer newTotalReviews) {
        this.avgRating = newAvgRating;
        this.totalReviews = newTotalReviews;
    }
}
package com.petstore.petservice.entity;

import com.petstore.petservice.enums.*;
import jakarta.persistence.*;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
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

    @Column(name = "origin_country")
    String originCountry; // "Việt Nam", "Mỹ"

    // === PHYSICAL CHARACTERISTICS ===
    @Column(name = "avg_weight_min")
    Double avgWeightMin; // kg

    @Column(name = "avg_weight_max")
    Double avgWeightMax; // kg

    @Column(name = "avg_height_min")
    Double avgHeightMin; // cm

    @Column(name = "avg_height_max")
    Double avgHeightMax; // cm

    @Column(name = "common_colors")
    String commonColors; // "Vàng, đen, trắng"

    @Column(name = "life_expectancy")
    String lifeExpectancy; // "10-15 năm"

    // === REVIEW STATS (TỔNG HỢP TỪ BẢNG REVIEW) ===
    @Column(name = "avg_rating")
    Double avgRating = 0.0;

    @Column(name = "total_reviews")
    Integer totalReviews = 0;

    // === MEDIA ===
    @Column(name = "image_url")
    String imageUrl; // Ảnh đại diện giống

    // === AI METADATA ===
    @Column(name = "model_3d_template_url")
    String model3dTemplateUrl; // Template 3D cho giống (nếu có)

    // === STATUS ===
    @Column(name = "is_active")
    Boolean isActive = true;

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
}
package com.petstore.petservice.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

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
    String name; // "Chó Phốc", "Mèo Ba Tư", "Chó Corgi", "Mèo Anh lông ngắn"

    @Column(name = "pet_type", nullable = false)
    String petType; // "dog", "cat"

    @Column(name = "group_name")
    String groupName; // "Chó săn", "Chó cảnh", "Mèo lông dài", "Mèo lông ngắn"

    @Column(length = 2000)
    String description; // Mô tả về giống

    @Column(name = "origin_country")
    String originCountry; // "Việt Nam", "Mỹ", "Anh", "Nhật Bản"

    // === PHYSICAL CHARACTERISTICS ===
    @Column(name = "size_category")
    String sizeCategory; // "small", "medium", "large"

    @Column(name = "avg_weight_min")
    Double avgWeightMin; // kg: 2.0, 5.0

    @Column(name = "avg_weight_max")
    Double avgWeightMax; // kg: 4.5, 8.0

    @Column(name = "avg_height_min")
    Double avgHeightMin; // cm: 20, 40

    @Column(name = "avg_height_max")
    Double avgHeightMax; // cm: 30, 60

    @Column(name = "common_colors")
    String commonColors; // "Vàng, đen, trắng", "Xám, trắng"

    @Column(name = "coat_type")
    String coatType; // "short", "medium", "long", "curly", "wire"

    @Column(name = "shedding_level")
    Integer sheddingLevel; // 1-5 (1: rụng ít, 5: rụng nhiều)

    // === PERSONALITY TRAITS ===
    @Column(name = "typical_energy")
    Integer typicalEnergy; // 1-5 (1: ít năng động, 5: rất năng động)

    @Column(name = "typical_trainability")
    Integer typicalTrainability; // 1-5 (1: khó huấn luyện, 5: dễ huấn luyện)

    @Column(name = "good_with_children")
    Integer goodWithChildren; // 1-5 (1: không tốt, 5: rất tốt với trẻ)

    @Column(name = "good_with_pets")
    Integer goodWithPets; // 1-5 (1: không tốt, 5: rất tốt với thú khác)

    @Column(name = "barking_level")
    Integer barkingLevel; // 1-5 (1: ít sủa, 5: sủa nhiều)

    // === CARE REQUIREMENTS ===
    @Column(name = "grooming_needs")
    String groomingNeeds; // "low", "medium", "high"

    @Column(name = "exercise_needs")
    String exerciseNeeds; // "low", "medium", "high"

    // === AI METADATA ===
    @Column(name = "model_3d_template_url")
    String model3dTemplateUrl; // URL file 3D template cho giống này

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    String[] aiPromptKeywords; // Keywords cho AI: ["năng động", "thân thiện", "lông xù"]

    // === STATUS ===
    @Column(name = "is_active")
    Boolean isActive = true; // true, false

    @Column(name = "display_order")
    Integer displayOrder = 0; // Thứ tự hiển thị

    // === MEDIA ===
    @Column(name = "image_url")
    String imageUrl; // Ảnh đại diện giống

    @Column(name = "icon_url")
    String iconUrl; // Icon nhỏ

    // === AUDIT ===
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
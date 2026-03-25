package com.petstore.petservice.entity;

import com.petstore.petservice.enums.*;
import jakarta.persistence.*;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "pets", indexes = {
        @Index(name = "idx_pet_type", columnList = "pet_type"),
        @Index(name = "idx_pet_status", columnList = "status"),
        @Index(name = "idx_pet_breed", columnList = "breed_id")
})
@Data
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class PetEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    // ========== BASIC INFO ==========
    @Column(nullable = false)
    String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "pet_type", nullable = false)
    PetType petType;

    @Column(name = "breed_id", nullable = false)
    UUID breedId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    Gender gender;

    @Column(name = "birth_date")
    LocalDate birthDate;

    // ========== PHYSICAL ATTRIBUTES ==========
    Double weight; // kg
    
    Double height; // cm
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    String[] colors; // Giữ JSON array ["vàng", "trắng", "đen"]

    @Enumerated(EnumType.STRING)
    @Column(name = "color_pattern")
    ColorPattern colorPattern; // solid, spotted, striped, v.v.

    @Enumerated(EnumType.STRING)
    @Column(name = "fur_type")
    FurType furType; // short, medium, long, hairless

    // ========== HEALTH ==========
    @Enumerated(EnumType.STRING)
    @Column(name = "health_status")
    HealthStatus healthStatus;

    @Column(name = "vaccinated")
    Boolean vaccinated;

    // ========== BUSINESS ==========
    @Column(nullable = false)
    Double price; // giá

    @Column(length = 2000)
    String description; // Mô tả chi tiết

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    PetStatus status; // AVAILABLE, SOLD, RESERVED, DRAFT

    // ========== MEDIA ==========
    @Column(name = "thumbnail_url")
    String thumbnailUrl; // Ảnh đại diện

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    String[] imageUrls; // Mảng ảnh thường

    // ========== METRICS ==========
    @Column(name = "view_count")
    Integer viewCount = 0;

    // ========== AI GENERATED ==========
    @Column(name = "ai_description", length = 2000)
    String aiDescription; // Mô tả AI sinh

    // ========== AUDIT ==========
    @Column(name = "created_at")
    LocalDateTime createdAt;

    @Column(name = "updated_at")
    LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (viewCount == null) viewCount = 0;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
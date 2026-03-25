package com.petstore.petservice.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "pet_3d_models", indexes = {
        @Index(name = "idx_3d_pet_id", columnList = "pet_id", unique = true)
})
@Data
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class Pet3DModelEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(name = "pet_id", nullable = false, unique = true)
    UUID petId; // 1-1 với pet

    @Column(name = "model_url")
    String modelUrl; // URL file GLB (cho Three.js)

    @Column(name = "source_image_url")
    String sourceImageUrl; // Ảnh gốc để tạo 3D

    @Column(name = "thumbnail_url")
    String thumbnailUrl; // Ảnh thumbnail từ model 3D

    @Column(name = "ai_generated")
    Boolean aiGenerated = false; // true nếu model được tạo bằng AI

    @Column(name = "confidence_score")
    Double confidenceScore; // Độ tin cậy AI (0.0 - 1.0)

    @Column(name = "generated_at")
    LocalDateTime generatedAt; // Thời gian tạo model

    @Column(name = "created_at")
    LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (generatedAt == null) generatedAt = LocalDateTime.now();
    }
}
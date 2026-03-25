package com.petstore.petservice.entity;

import com.petstore.petservice.enums.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "pets", indexes = {
        @Index(name = "idx_pet_status", columnList = "status"),
        @Index(name = "idx_pet_breed", columnList = "breed_id")
})
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class PetEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    // ========== BASIC INFO ==========
    @Column(nullable = false)
    String name;

    @Column(name = "breed_id", nullable = false)
    UUID breedId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "breed_id", insertable = false, updatable = false)
    BreedEntity breed;

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
    List<String> colors; // JSON array ["vàng", "trắng", "đen"]

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
    @Column(nullable = false, precision = 19, scale = 2)
    BigDecimal price; // giá

    @Column(length = 2000)
    String description; // Mô tả chi tiết

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    PetStatus status; // AVAILABLE, SOLD, RESERVED, DRAFT

    // ========== MEDIA ==========
    // Đã tách ảnh sang bảng pet_images riêng
    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("sortOrder ASC")
    List<PetImageEntity> images = new ArrayList<>();

    // ========== METRICS ==========
    @Column(name = "view_count")
    Integer viewCount = 0;

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
        if (colors == null) colors = new ArrayList<>();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Helper methods để quản lý ảnh
    public void addImage(String imageUrl, Boolean isThumbnail) {
        PetImageEntity image = new PetImageEntity();
        image.setImageUrl(imageUrl);
        image.setIsThumbnail(isThumbnail);
        image.setSortOrder(this.images.size());
        image.setPet(this);
        this.images.add(image);
    }
    
    public void removeImage(PetImageEntity image) {
        this.images.remove(image);
        image.setPet(null);
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PetEntity)) return false;
        PetEntity petEntity = (PetEntity) o;
        return id != null && Objects.equals(id, petEntity.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
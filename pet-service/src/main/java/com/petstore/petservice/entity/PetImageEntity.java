package com.petstore.petservice.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "pet_images", indexes = {
        @Index(name = "idx_pet_image_pet_id", columnList = "pet_id"),
        @Index(name = "idx_pet_image_thumbnail", columnList = "is_thumbnail")
})
@Getter
@Setter
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class PetImageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    PetEntity pet;

    @Column(name = "image_url", nullable = false, length = 500)
    String imageUrl;

    @Column(name = "is_thumbnail")
    Boolean isThumbnail = false;

    @Column(name = "sort_order")
    Integer sortOrder = 0;

    @Column(name = "created_at")
    LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (sortOrder == null) sortOrder = 0;
        if (isThumbnail == null) isThumbnail = false;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PetImageEntity)) return false;
        PetImageEntity that = (PetImageEntity) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
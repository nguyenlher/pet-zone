package com.petstore.petservice.infra.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.petstore.petservice.domain.model.enums.ProductCategory;
import com.petstore.petservice.domain.model.enums.ProductStatus;

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
@Table(name = "products")
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class ProductEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    UUID id;
    
    @Column(name = "name", nullable = false)
    String name;
    
    @Column(name = "brand")
    String brand;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    ProductCategory category;
    
    @Column(name = "pet_type_id")
    UUID petTypeId;
    
    @Column(name = "price", nullable = false)
    BigDecimal price;
    
    @Column(name = "stock_quantity")
    @Builder.Default
    Integer stockQuantity = 0;
    
    @Column(name = "sold_count")
    @Builder.Default
    Integer soldCount = 0;
    
    @Column(name = "description", columnDefinition = "TEXT")
    String description;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    @Builder.Default
    ProductStatus status = ProductStatus.AVAILABLE;
    
    @Column(name = "avg_rating")
    @Builder.Default
    Double avgRating = 0.0;
    
    @Column(name = "total_reviews")
    @Builder.Default
    Integer totalReviews = 0;
    
    @Column(name = "view_count")
    @Builder.Default
    Integer viewCount = 0;
    
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

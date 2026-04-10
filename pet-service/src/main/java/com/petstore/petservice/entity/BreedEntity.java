package com.petstore.petservice.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
@Table(name = "breeds")
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class BreedEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    UUID id;
    
    @Column(name = "name")
    String name;
    
    @Column(name = "pet_type_id")
    UUID petTypeId;
    
    @Column(name = "description")
    String description;
    
    @Column(name = "avg_rating")
    Double avgRating;
    
    @Column(name = "total_reviews")
    @Builder.Default
    Integer totalReviews = 0;
    
    @Column(name = "image_url")
    String imageUrl;
    
    @Column(name = "is_active")
    @Builder.Default
    Boolean isActive = true;
    
    @Column(name = "created_at")
    LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    LocalDateTime updatedAt;
}

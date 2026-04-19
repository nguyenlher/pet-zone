package com.petstore.petservice.infra.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "pet_images")
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class PetImageEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id")
    PetEntity pet;
    
    @Column(name = "image_url")
    String imageUrl;
    
    @Column(name = "is_thumbnail")
    @Builder.Default
    Boolean isThumbnail = false;
    
    @Column(name = "display_order")
    Integer displayOrder;
    
    @Column(name = "created_at")
    LocalDateTime createdAt;
}

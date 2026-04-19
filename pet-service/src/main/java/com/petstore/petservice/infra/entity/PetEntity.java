package com.petstore.petservice.infra.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.petstore.petservice.domain.model.enums.FurType;
import com.petstore.petservice.domain.model.enums.Gender;
import com.petstore.petservice.domain.model.enums.HealthStatus;
import com.petstore.petservice.domain.model.enums.PetStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "pets")
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class PetEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    UUID id;
    
    @Column(name = "breed_id")
    UUID breedId;
    
    @Column(name = "name")
    String name;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    Gender gender;
    
    @Column(name = "birth_date")
    LocalDate birthDate;
    
    @Column(name = "weight")
    Double weight;
    
    @Column(name = "colors")
    List<String> colors;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "fur_type")
    FurType furType;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "health_status")
    HealthStatus healthStatus;
    
    @Column(name = "vaccinated")
    Boolean vaccinated;
    
    @Column(name = "price")
    BigDecimal price;
    
    @Column(name = "description")
    String description;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    PetStatus status;
    
    @Column(name = "view_count")
    @Builder.Default
    Integer viewCount = 0;
    
    @Column(name = "created_at")
    LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    LocalDateTime updatedAt;
}

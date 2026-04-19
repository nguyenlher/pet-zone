package com.petstore.petservice.domain.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.petstore.petservice.domain.model.enums.FurType;
import com.petstore.petservice.domain.model.enums.Gender;
import com.petstore.petservice.domain.model.enums.HealthStatus;
import com.petstore.petservice.domain.model.enums.PetStatus;

import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@Table(name = "pets")
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class Pet {
    UUID id;
    UUID breedId;
    String name;
    Gender gender;
    LocalDate birthDate;
    Double weight;
    List<String> colors;
    FurType furType;
    HealthStatus healthStatus;
    Boolean vaccinated;
    BigDecimal price;
    String description;
    PetStatus status;
    Integer viewCount;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
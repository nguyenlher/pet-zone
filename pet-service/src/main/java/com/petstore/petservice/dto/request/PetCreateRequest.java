package com.petstore.petservice.dto.request;

import com.petstore.petservice.enums.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PetCreateRequest {
    @NotBlank(message = "Pet name is required")
    @Size(min = 2, max = 100, message = "Pet name must be between 2 and 100 characters")
    private String name;
    
    @NotNull(message = "Pet type is required")
    private PetType petType;
    
    @NotNull(message = "Breed is required")
    private UUID breedId;
    
    @NotNull(message = "Gender is required")
    private Gender gender;
    
    private LocalDate birthDate;
    
    @DecimalMin(value = "0.1", message = "Weight must be at least 0.1 kg")
    @DecimalMax(value = "100", message = "Weight must not exceed 100 kg")
    private Double weight;
    
    @DecimalMin(value = "1", message = "Height must be at least 1 cm")
    @DecimalMax(value = "150", message = "Height must not exceed 150 cm")
    private Double height;
    
    private String[] colors;
    private ColorPattern colorPattern;
    private FurType furType;
    
    private HealthStatus healthStatus;
    private Boolean vaccinated;
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private Double price;
    
    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;
    
    private PetStatus status;
    
    private String thumbnailUrl;
    private String[] imageUrls;
    
    // For AI 3D Model
    private String sourceImageFor3D;
}
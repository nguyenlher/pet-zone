package com.petstore.petservice.api.dto.request;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import com.petstore.petservice.domain.model.enums.ProductCategory;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePetProductRequest {
    
    @NotBlank(message = "Product name is required")
    private String name;
    
    private String brand;
    
    @NotNull(message = "Category is required")
    private ProductCategory category;
    
    private UUID petTypeId;
    
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;
    
    @Min(value = 0, message = "Stock quantity must be non-negative")
    private Integer stockQuantity;
    
    private String description;
    
    private List<String> imageUrls;
}

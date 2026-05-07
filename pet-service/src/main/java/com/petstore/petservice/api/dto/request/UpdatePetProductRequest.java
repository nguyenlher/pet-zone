package com.petstore.petservice.api.dto.request;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import com.petstore.petservice.domain.model.enums.ProductCategory;
import com.petstore.petservice.domain.model.enums.ProductStatus;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePetProductRequest {
    
    private String name;
    
    private String brand;
    
    private ProductCategory category;
    
    private UUID petTypeId;
    
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;
    
    @Min(value = 0, message = "Stock quantity must be non-negative")
    private Integer stockQuantity;
    
    private String description;
    
    private ProductStatus status;
    
    private List<String> imageUrls;
}

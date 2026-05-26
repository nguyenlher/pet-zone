package com.petstore.petservice.api.dto.request;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pet3DModelSaveRequest {
    
    @NotNull(message = "Pet ID is required")
    private UUID petId;
    
    @NotBlank(message = "Model URL is required")
    private String modelUrl;
    
    @NotBlank(message = "Source image URL is required")
    private String sourceImageUrl;
}

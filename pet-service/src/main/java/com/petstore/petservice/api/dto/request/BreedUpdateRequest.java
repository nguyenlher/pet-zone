package com.petstore.petservice.api.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BreedUpdateRequest {
    
    private String name;
    
    private String description;
    
    private String imageUrl;
    
    private Boolean isActive;
}

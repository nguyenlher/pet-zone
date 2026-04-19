package com.petstore.petservice.api.dto.request;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BreedCreateRequest {
    private String name;
    
    private UUID petTypeId;
    
    private String description;
    
    private String imageUrl;
}

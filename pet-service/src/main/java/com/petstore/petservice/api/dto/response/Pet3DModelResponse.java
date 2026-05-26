package com.petstore.petservice.api.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Pet3DModelResponse {
    private UUID id;
    private UUID petId;
    private String modelUrl;
    private String sourceImageUrl;
    private LocalDateTime createdAt;
}
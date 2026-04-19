package com.petstore.petservice.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Pet3DModelResponse {
    private UUID id;
    private UUID petId;
    private String modelUrl;
    private String thumbnailUrl;
    private Boolean aiGenerated;
    private Double confidenceScore;
    private LocalDateTime generatedAt;
}
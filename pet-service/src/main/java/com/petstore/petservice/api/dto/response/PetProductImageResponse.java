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
public class PetProductImageResponse {
    private UUID id;
    private String imageUrl;
    private Boolean isThumbnail;
    private Integer displayOrder;
    private LocalDateTime createdAt;
}

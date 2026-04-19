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
public class PetImageResponse {
    private UUID id;
    private String imageUrl;
    private Boolean isThumbnail;
    private Integer sortOrder;
    private LocalDateTime createdAt;
}
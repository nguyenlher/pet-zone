package com.petstore.petservice.api.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import com.petstore.petservice.domain.model.enums.EntityType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private UUID id;
    private EntityType entityType;
    private UUID entityId;
    private UUID userId;
    private String userName;
    private Integer rating;
    private String comment;
    private Boolean isVerifiedPurchase;
    private Integer likes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

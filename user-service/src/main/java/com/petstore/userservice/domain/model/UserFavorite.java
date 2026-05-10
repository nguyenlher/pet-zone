package com.petstore.userservice.domain.model;

import java.time.Instant;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserFavorite {
    private UUID id;
    private UUID userId;
    private UUID petId;
    private Instant createdAt;
}

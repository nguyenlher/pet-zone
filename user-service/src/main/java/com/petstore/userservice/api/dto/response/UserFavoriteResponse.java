package com.petstore.userservice.api.dto.response;

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
public class UserFavoriteResponse {
    private UUID id;
    private UUID userId;
    private UUID petId;
    private Instant createdAt;
}

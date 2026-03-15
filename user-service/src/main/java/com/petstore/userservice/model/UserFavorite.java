package com.petstore.userservice.model;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class UserFavorite {
    UUID id;
    UUID userId;
    UUID petId;
    LocalDateTime createdAt;
}

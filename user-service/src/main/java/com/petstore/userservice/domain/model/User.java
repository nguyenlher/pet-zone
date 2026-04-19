package com.petstore.userservice.domain.model;


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
public class User {
    UUID id;
    String keycloakId;
    String email;
    String firstName;
    String lastName;
    String avatarUrl;
    Boolean isActive;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
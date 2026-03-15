package com.petstore.userservice.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "user_favorites")
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class UserFavoriteEnity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(name = "user_id")
    UUID userId;

    @Column(name = "pet_id")
    UUID petId;

    @Column(name = "created_at")
    LocalDateTime createdAt;
}

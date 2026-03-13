package com.petstore.userservice.repository.jpa;

import com.petstore.userservice.entity.UserFavoriteEnity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface JpaUserFavoriteRepository extends JpaRepository<UserFavoriteEnity, UUID> {
}

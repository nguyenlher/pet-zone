package com.petstore.userservice.repository;

import com.petstore.userservice.model.UserFavorite;

public interface UserFavoriteRepository {
    void save(UserFavorite userFavorite);
}

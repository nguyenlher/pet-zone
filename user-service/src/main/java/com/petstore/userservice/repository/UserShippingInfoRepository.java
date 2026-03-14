package com.petstore.userservice.repository;

import java.util.Optional;
import java.util.UUID;

import com.petstore.userservice.model.UserShippingInfo;

public interface UserShippingInfoRepository {
    UserShippingInfo save(UserShippingInfo userShippingInfo);
    Optional<UserShippingInfo> findById(UUID id);
    void deleteById(UUID id);
}

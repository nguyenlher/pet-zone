package com.petstore.userservice.repository;

import com.petstore.userservice.model.UserShippingInfo;

import java.util.Optional;
import java.util.UUID;

public interface UserShippingInfoRepository {
    UserShippingInfo save(UserShippingInfo userShippingInfo);
    Optional<UserShippingInfo> findById(UUID id);
    void deleteById(UUID id);
}

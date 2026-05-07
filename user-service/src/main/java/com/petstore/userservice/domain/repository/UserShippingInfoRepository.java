package com.petstore.userservice.domain.repository;

import java.util.Optional;
import java.util.UUID;

import com.petstore.userservice.domain.model.UserShippingInfo;

public interface UserShippingInfoRepository {
    UserShippingInfo save(UserShippingInfo userShippingInfo);
    Optional<UserShippingInfo> findById(UUID id);
    void deleteById(UUID id);
}

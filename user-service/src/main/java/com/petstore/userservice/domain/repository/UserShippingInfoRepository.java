package com.petstore.userservice.domain.repository;

import com.petstore.userservice.domain.model.UserShippingInfo;

import java.util.Optional;
import java.util.UUID;

public interface UserShippingInfoRepository {
    UserShippingInfo save(UserShippingInfo userShippingInfo);
    Optional<UserShippingInfo> findById(UUID id);
    void deleteById(UUID id);
}

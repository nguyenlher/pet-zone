package com.petstore.userservice.domain.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.petstore.userservice.domain.model.UserShippingInfo;

public interface UserShippingInfoRepository {
    UserShippingInfo save(UserShippingInfo userShippingInfo);
    Optional<UserShippingInfo> findById(UUID id);
    Optional<UserShippingInfo> findDefaultByUserId(UUID userId);
    List<UserShippingInfo> findAllByUserId(UUID userId);
    void deleteById(UUID id);
}

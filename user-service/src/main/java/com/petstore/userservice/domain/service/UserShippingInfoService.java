package com.petstore.userservice.domain.service;

import com.petstore.userservice.api.dto.request.UserShippingInfoRequest;
import com.petstore.userservice.domain.model.UserShippingInfo;

import java.util.UUID;

public interface UserShippingInfoService {
    UserShippingInfo createUserShippingInfo(UserShippingInfoRequest request);
    UserShippingInfo updateUserShippingInfo(UserShippingInfoRequest request);
    void deleteUserShippingInfo(UUID userShippingInfoId);
}

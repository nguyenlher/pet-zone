package com.petstore.userservice.domain.service;

import java.util.UUID;

import com.petstore.userservice.api.dto.request.UserShippingInfoRequest;
import com.petstore.userservice.domain.model.UserShippingInfo;

public interface UserShippingInfoService {
    UserShippingInfo createUserShippingInfo(UserShippingInfoRequest request);
    UserShippingInfo updateUserShippingInfo(UserShippingInfoRequest request);
    void deleteUserShippingInfo(UUID userShippingInfoId);
}

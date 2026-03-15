package com.petstore.userservice.service;

import com.petstore.userservice.dto.request.UserShippingInfoRequest;
import com.petstore.userservice.dto.response.MessageResponse;
import com.petstore.userservice.model.UserShippingInfo;
import com.petstore.userservice.repository.UserShippingInfoRepository;

import java.util.UUID;

public interface UserShippingInfoService {
    UserShippingInfo createUserShippingInfo(UserShippingInfoRequest request);
    UserShippingInfo updateUserShippingInfo(UserShippingInfoRequest request);
    void deleteUserShippingInfo(UUID userShippingInfoId);
}

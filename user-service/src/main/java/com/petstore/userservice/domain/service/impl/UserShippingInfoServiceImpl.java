package com.petstore.userservice.domain.service.impl;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.petstore.userservice.api.dto.request.UserShippingInfoRequest;
import com.petstore.userservice.domain.model.UserShippingInfo;
import com.petstore.userservice.domain.repository.UserShippingInfoRepository;
import com.petstore.userservice.domain.service.UserShippingInfoService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserShippingInfoServiceImpl implements UserShippingInfoService {
    private final UserShippingInfoRepository userShippingInfoRepository;

    @Override
    public UserShippingInfo createUserShippingInfo(UserShippingInfoRequest request) {
        UserShippingInfo created = UserShippingInfo.builder()
                .userId(request.getUserId())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .city(request.getCity())
                .isDefault(Boolean.TRUE.equals(request.getIsDefault()))
                .build();

        UserShippingInfo saved = userShippingInfoRepository.save(created);
        log.info("UserShippingInfo saved to DB for User ID: {}", saved.getUserId());
        return saved;
    }

    @Override
    public UserShippingInfo updateUserShippingInfo(UserShippingInfoRequest request) {
        UserShippingInfo userShippingInfo = userShippingInfoRepository.findById(request.getId())
                .orElseThrow(() -> new RuntimeException("UserShippingInfo not found with ID: " + request.getId()));

        UserShippingInfo updated = UserShippingInfo.builder()
                .id(userShippingInfo.getId())
                .userId(request.getUserId() != null ? request.getUserId() : userShippingInfo.getUserId())
                .phoneNumber(request.getPhoneNumber() != null ? request.getPhoneNumber() : userShippingInfo.getPhoneNumber())
                .address(request.getAddress() != null ? request.getAddress() : userShippingInfo.getAddress())
                .city(request.getCity() != null ? request.getCity() : userShippingInfo.getCity())
                .isDefault(Boolean.TRUE.equals(request.getIsDefault()) ? true : userShippingInfo.isDefault())
                .createdAt(userShippingInfo.getCreatedAt())
                .updatedAt(request.getUpdatedAt() != null ? request.getUpdatedAt() : userShippingInfo.getUpdatedAt())
                .build();

        log.info("UserShippingInfo updated or User ID: {}", updated.getId());
        return userShippingInfoRepository.save(updated);
    }

    @Override
    public void deleteUserShippingInfo(UUID userShippingInfoId) {
        UserShippingInfo userShippingInfo = userShippingInfoRepository.findById(userShippingInfoId)
                .orElseThrow(() -> new RuntimeException("UserShippingInfo not found with ID: " + userShippingInfoId));

        log.info("UserShippingInfo deleted for User ID: {}", userShippingInfo.getUserId());
        userShippingInfoRepository.deleteById(userShippingInfoId);
    }
}

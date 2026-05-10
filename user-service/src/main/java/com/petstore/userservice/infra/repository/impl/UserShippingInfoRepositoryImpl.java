package com.petstore.userservice.infra.repository.impl;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import com.petstore.userservice.domain.model.UserShippingInfo;
import com.petstore.userservice.domain.repository.UserShippingInfoRepository;
import com.petstore.userservice.infra.entity.UserShippingInfoEntity;
import com.petstore.userservice.infra.mapper.UserShippingInfoMapper;
import com.petstore.userservice.infra.repository.jpa.JpaUserShippingInfoRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class UserShippingInfoRepositoryImpl implements UserShippingInfoRepository {
    private final JpaUserShippingInfoRepository jpaUserShippingInfoRepository;
    private final UserShippingInfoMapper mapper;

    @Override
    public UserShippingInfo save(UserShippingInfo userShippingInfo) {
        UserShippingInfoEntity entity = mapper.toEntity(userShippingInfo);
        UserShippingInfoEntity savedEntity = jpaUserShippingInfoRepository.save(entity);
        return mapper.toDomain(savedEntity);
    }

    @Override
    public Optional<UserShippingInfo> findById(UUID id) {
        return jpaUserShippingInfoRepository.findById(id)
                .map(mapper::toDomain);
    }

    @Override
    public Optional<UserShippingInfo> findDefaultByUserId(UUID userId) {
        return jpaUserShippingInfoRepository.findByUserIdAndIsDefaultTrue(userId)
                .map(mapper::toDomain);
    }

    @Override
    public List<UserShippingInfo> findAllByUserId(UUID userId) {
        return jpaUserShippingInfoRepository.findAllByUserId(userId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(UUID id) {
        jpaUserShippingInfoRepository.deleteById(id);
    }
}

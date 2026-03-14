package com.petstore.userservice.repository.impl;

import com.petstore.userservice.entity.UserShippingInfoEntity;
import com.petstore.userservice.mapper.UserShippingInfoMapper;
import com.petstore.userservice.model.UserShippingInfo;
import com.petstore.userservice.repository.UserShippingInfoRepository;
import com.petstore.userservice.repository.jpa.JpaUserShippingInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

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
    public void deleteById(UUID id) {
        jpaUserShippingInfoRepository.deleteById(id);
    }
}

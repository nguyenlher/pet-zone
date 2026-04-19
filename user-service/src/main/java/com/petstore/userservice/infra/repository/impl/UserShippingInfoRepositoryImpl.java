package com.petstore.userservice.infra.repository.impl;

import com.petstore.userservice.infra.entity.UserShippingInfoEntity;
import com.petstore.userservice.infra.mapper.UserShippingInfoMapper;
import com.petstore.userservice.domain.model.UserShippingInfo;
import com.petstore.userservice.domain.repository.UserShippingInfoRepository;
import com.petstore.userservice.infra.repository.jpa.JpaUserShippingInfoRepository;
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

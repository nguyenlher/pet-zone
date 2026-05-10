package com.petstore.userservice.infra.repository.jpa;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.petstore.userservice.infra.entity.UserShippingInfoEntity;

public interface JpaUserShippingInfoRepository extends JpaRepository<UserShippingInfoEntity, UUID> {
    Optional<UserShippingInfoEntity> findByUserIdAndIsDefaultTrue(UUID userId);
    List<UserShippingInfoEntity> findAllByUserId(UUID userId);
}

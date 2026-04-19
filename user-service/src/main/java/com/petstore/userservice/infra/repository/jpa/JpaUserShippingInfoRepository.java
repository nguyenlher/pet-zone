package com.petstore.userservice.infra.repository.jpa;

import com.petstore.userservice.infra.entity.UserShippingInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface JpaUserShippingInfoRepository extends JpaRepository<UserShippingInfoEntity, UUID> {
}

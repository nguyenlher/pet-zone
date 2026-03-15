package com.petstore.userservice.repository.jpa;

import com.petstore.userservice.entity.UserShippingInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface JpaUserShippingInfoRepository extends JpaRepository<UserShippingInfoEntity, UUID> {
}

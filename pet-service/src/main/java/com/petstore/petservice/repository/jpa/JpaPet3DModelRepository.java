package com.petstore.petservice.repository.jpa;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.petstore.petservice.entity.Pet3DModelEntity;

@Repository
public interface JpaPet3DModelRepository extends JpaRepository<Pet3DModelEntity, UUID> {
}

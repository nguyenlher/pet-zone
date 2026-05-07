package com.petstore.petservice.infra.repository.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Repository;

import com.petstore.petservice.domain.model.PetProductImage;
import com.petstore.petservice.domain.model.enums.EntityType;
import com.petstore.petservice.domain.repository.PetProductImageRepository;
import com.petstore.petservice.infra.mapper.PetProductImageMapper;
import com.petstore.petservice.infra.repository.jpa.JpaPetProductImageRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class PetProductImageRepositoryImpl implements PetProductImageRepository {

    private final JpaPetProductImageRepository jpaRepository;
    private final PetProductImageMapper mapper;

    @Override
    public List<PetProductImage> findByEntityTypeAndEntityId(EntityType entityType, UUID entityId) {
        return mapper.toDomainList(jpaRepository.findByEntityTypeAndEntityId(entityType, entityId));
    }

    @Override
    public PetProductImage save(PetProductImage image) {
        return mapper.toDomain(jpaRepository.save(mapper.toEntity(image)));
    }

    @Override
    public void delete(UUID id) {
        jpaRepository.deleteById(id);
    }
}

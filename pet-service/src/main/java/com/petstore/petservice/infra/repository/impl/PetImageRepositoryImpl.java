package com.petstore.petservice.infra.repository.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Repository;

import com.petstore.petservice.infra.mapper.PetImageMapper;
import com.petstore.petservice.domain.model.PetImage;
import com.petstore.petservice.domain.repository.PetImageRepository;
import com.petstore.petservice.infra.repository.jpa.JpaPetImageRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class PetImageRepositoryImpl implements PetImageRepository {

    private final JpaPetImageRepository jpaPetImageRepository;
    private final PetImageMapper petImageMapper;

    @Override
    public List<PetImage> findByPetId(UUID petId) {
        return petImageMapper.toDomainList(jpaPetImageRepository.findByPetId(petId));
    }
}

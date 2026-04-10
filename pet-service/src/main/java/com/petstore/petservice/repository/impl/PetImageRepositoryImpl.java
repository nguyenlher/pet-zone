package com.petstore.petservice.repository.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Repository;

import com.petstore.petservice.mapper.PetImageMapper;
import com.petstore.petservice.model.PetImage;
import com.petstore.petservice.repository.PetImageRepository;
import com.petstore.petservice.repository.jpa.JpaPetImageRepository;

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

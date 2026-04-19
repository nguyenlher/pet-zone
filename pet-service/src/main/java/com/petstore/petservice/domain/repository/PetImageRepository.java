package com.petstore.petservice.domain.repository;

import java.util.List;
import java.util.UUID;

import com.petstore.petservice.domain.model.PetImage;

public interface PetImageRepository {
    List<PetImage> findByPetId(UUID petId);
}

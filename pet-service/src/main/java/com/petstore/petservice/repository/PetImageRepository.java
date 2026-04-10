package com.petstore.petservice.repository;

import java.util.List;
import java.util.UUID;

import com.petstore.petservice.model.PetImage;

public interface PetImageRepository {
    List<PetImage> findByPetId(UUID petId);
}

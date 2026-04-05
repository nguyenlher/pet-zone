package com.petstore.petservice.service;

import java.util.List;

import com.petstore.petservice.dto.response.BreedResponse;
import com.petstore.petservice.model.enums.PetType;

public interface BreedService {
    List<BreedResponse> getBreedsByType(PetType petType);
}

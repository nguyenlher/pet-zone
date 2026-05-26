package com.petstore.petservice.domain.service;

import java.util.List;
import java.util.UUID;

import com.petstore.petservice.api.dto.request.BreedCreateRequest;
import com.petstore.petservice.api.dto.request.BreedUpdateRequest;
import com.petstore.petservice.api.dto.response.BreedResponse;

public interface BreedService {
    BreedResponse create(BreedCreateRequest request);
    BreedResponse update(UUID id, BreedUpdateRequest request);
    BreedResponse getById(UUID id);
    List<BreedResponse> getByPetTypeId(UUID petTypeId);
    List<BreedResponse> getAll();
    void delete(UUID id);
}

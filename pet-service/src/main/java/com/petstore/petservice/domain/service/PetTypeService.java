package com.petstore.petservice.domain.service;

import java.util.List;
import java.util.UUID;

import com.petstore.petservice.api.dto.request.PetTypeCreateRequest;
import com.petstore.petservice.api.dto.request.PetTypeUpdateRequest;
import com.petstore.petservice.api.dto.response.PetTypeResponse;

public interface PetTypeService {
    PetTypeResponse create(PetTypeCreateRequest request);
    PetTypeResponse update(UUID id, PetTypeUpdateRequest request);
    PetTypeResponse getById(UUID id);
    List<PetTypeResponse> getAll();
    List<PetTypeResponse> getAllActive();
    void delete(UUID id);
}

package com.petstore.petservice.service;

import java.util.List;
import java.util.UUID;

import com.petstore.petservice.dto.request.PetTypeCreateRequest;
import com.petstore.petservice.dto.request.PetTypeUpdateRequest;
import com.petstore.petservice.dto.response.PetTypeResponse;

public interface PetTypeService {
    PetTypeResponse create(PetTypeCreateRequest request);
    PetTypeResponse update(UUID id, PetTypeUpdateRequest request);
    PetTypeResponse getById(UUID id);
    List<PetTypeResponse> getAll();
    List<PetTypeResponse> getAllActive();
    void delete(UUID id);
}

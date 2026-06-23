package com.petstore.petservice.domain.service;

import java.math.BigDecimal;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.petstore.petservice.api.dto.request.Pet3DModelSaveRequest;
import com.petstore.petservice.api.dto.request.PetCreateRequest;
import com.petstore.petservice.api.dto.request.PetUpdateRequest;
import com.petstore.petservice.api.dto.response.Pet3DModelResponse;
import com.petstore.petservice.api.dto.response.PetDetailResponse;
import com.petstore.petservice.api.dto.response.PetResponse;
import com.petstore.petservice.domain.model.enums.PetStatus;

public interface PetService {
    PetDetailResponse create(PetCreateRequest request);
    PetDetailResponse update(UUID id, PetUpdateRequest request);
    PetDetailResponse getById(UUID id);
    Page<PetResponse> getAll(Pageable pageable);
    Page<PetResponse> getByStatus(PetStatus status, Pageable pageable);
    Page<PetResponse> getPetsWithFilters(BigDecimal minPrice, BigDecimal maxPrice, PetStatus status, String keyword, Pageable pageable);
    void incrementViewCount(UUID id);
    void updateStatus(UUID id, PetStatus status);
    boolean checkAvailability(UUID id);
    void delete(UUID id);
    Pet3DModelResponse save3DModel(Pet3DModelSaveRequest request);
}

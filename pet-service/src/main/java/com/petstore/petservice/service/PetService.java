package com.petstore.petservice.service;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.petstore.petservice.dto.request.PetCreateRequest;
import com.petstore.petservice.dto.request.PetUpdateRequest;
import com.petstore.petservice.dto.response.PetDetailResponse;
import com.petstore.petservice.dto.response.PetResponse;
import com.petstore.petservice.model.enums.PetStatus;

public interface PetService {
    PetDetailResponse create(PetCreateRequest request);
    PetDetailResponse update(UUID id, PetUpdateRequest request);
    PetDetailResponse getById(UUID id);
    Page<PetResponse> getByStatus(PetStatus status, Pageable pageable);
    void incrementViewCount(UUID id);
    void updateStatus(UUID id, PetStatus status);
    boolean checkAvailability(UUID id);
    void delete(UUID id);
}

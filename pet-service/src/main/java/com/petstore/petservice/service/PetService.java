package com.petstore.petservice.service;

import com.petstore.petservice.dto.request.PetCreateRequest;
import com.petstore.petservice.dto.request.PetSearchRequest;
import com.petstore.petservice.dto.request.PetUpdateRequest;
import com.petstore.petservice.dto.response.PetDetailResponse;
import com.petstore.petservice.dto.response.PetResponse;
import com.petstore.petservice.enums.PetType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface PetService {
    // Admin endpoints
    PetDetailResponse createPet(PetCreateRequest request, String username);
    PetDetailResponse updatePet(UUID id, PetUpdateRequest request, String username);
    void deletePet(UUID id);
    
    // Public endpoints
    Page<PetResponse> getAllAvailablePets(Pageable pageable);
    PetDetailResponse getPetById(UUID id);
    Page<PetResponse> searchPets(PetSearchRequest request, Pageable pageable);
    Page<PetResponse> getPetsByType(PetType petType, Pageable pageable);
    
    // Utility methods
    void incrementViewCount(UUID id);
    void incrementInquiryCount(UUID id);
}
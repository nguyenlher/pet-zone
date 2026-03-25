package com.petstore.petservice.controller;

import com.petstore.petservice.dto.request.PetCreateRequest;
import com.petstore.petservice.dto.request.PetSearchRequest;
import com.petstore.petservice.dto.request.PetUpdateRequest;
import com.petstore.petservice.dto.response.MessageResponse;
import com.petstore.petservice.dto.response.PetDetailResponse;
import com.petstore.petservice.dto.response.PetResponse;
import com.petstore.petservice.enums.PetType;
import com.petstore.petservice.service.PetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/pets")
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;

    // ========== PUBLIC ENDPOINTS ==========
    
    @GetMapping("/public")
    public ResponseEntity<Page<PetResponse>> getAllAvailablePets(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(petService.getAllAvailablePets(pageable));
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<PetDetailResponse> getPetById(@PathVariable UUID id) {
        PetDetailResponse pet = petService.getPetById(id);
        petService.incrementViewCount(id);
        return ResponseEntity.ok(pet);
    }

    @GetMapping("/public/type/{petType}")
    public ResponseEntity<Page<PetResponse>> getPetsByType(
            @PathVariable PetType petType,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(petService.getPetsByType(petType, pageable));
    }

    @PostMapping("/public/search")
    public ResponseEntity<Page<PetResponse>> searchPets(
            @RequestBody @Valid PetSearchRequest searchRequest,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(petService.searchPets(searchRequest, pageable));
    }

    // ========== ADMIN ENDPOINTS ==========
    
    @PostMapping("/admin")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<PetDetailResponse> createPet(
            @Valid @RequestBody PetCreateRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getClaimAsString("preferred_username");
        return ResponseEntity.ok(petService.createPet(request, username));
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<PetDetailResponse> updatePet(
            @PathVariable UUID id,
            @Valid @RequestBody PetUpdateRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getClaimAsString("preferred_username");
        return ResponseEntity.ok(petService.updatePet(id, request, username));
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<MessageResponse> deletePet(@PathVariable UUID id) {
        petService.deletePet(id);
        return ResponseEntity.ok(MessageResponse.builder()
                .message("Pet deleted successfully")
                .success(true)
                .build());
    }

    // ========== USER INTERACTION ENDPOINTS ==========
    
    @PostMapping("/{id}/inquiry")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> incrementInquiry(@PathVariable UUID id) {
        petService.incrementInquiryCount(id);
        return ResponseEntity.ok(MessageResponse.builder()
                .message("Inquiry recorded")
                .success(true)
                .build());
    }
}
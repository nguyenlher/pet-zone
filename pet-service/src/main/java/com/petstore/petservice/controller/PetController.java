package com.petstore.petservice.controller;

import com.petstore.petservice.dto.request.PetCreateRequest;
import com.petstore.petservice.dto.request.PetSearchRequest;
import com.petstore.petservice.dto.request.PetUpdateRequest;
import com.petstore.petservice.dto.response.MessageResponse;
import com.petstore.petservice.dto.response.PetDetailResponse;
import com.petstore.petservice.dto.response.PetResponse;
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

    // ========== PUBLIC ENDPOINTS (Không cần đăng nhập) ==========
    
    @GetMapping("/public")
    public ResponseEntity<Page<PetResponse>> getAllAvailablePets(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(petService.getAllAvailablePets(pageable));
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<PetDetailResponse> getPetById(@PathVariable UUID id) {
        PetDetailResponse pet = petService.getPetById(id);
        petService.incrementViewCount(id); // Tăng lượt xem
        return ResponseEntity.ok(pet);
    }

    @GetMapping("/public/type/{petType}")
    public ResponseEntity<Page<PetResponse>> getPetsByType(
            @PathVariable String petType,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(petService.getPetsByType(petType, pageable));
    }

    @GetMapping("/public/featured")
    public ResponseEntity<Page<PetResponse>> getFeaturedPets(
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(petService.getFeaturedPets(pageable));
    }

    @PostMapping("/public/search")
    public ResponseEntity<Page<PetResponse>> searchPets(
            @RequestBody @Valid PetSearchRequest searchRequest,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(petService.searchPets(searchRequest, pageable));
    }

    // ========== ADMIN ENDPOINTS (Chỉ admin mới có quyền) ==========
    
    @PostMapping("/admin")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<PetDetailResponse> createPet(
            @Valid @RequestBody PetCreateRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getClaimAsString("preferred_username");
        PetDetailResponse response = petService.createPet(request, username);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/admin/{id}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<PetDetailResponse> updatePet(
            @PathVariable UUID id,
            @Valid @RequestBody PetUpdateRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getClaimAsString("preferred_username");
        PetDetailResponse response = petService.updatePet(id, request, username);
        return ResponseEntity.ok(response);
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

    // ========== USER INTERACTION ENDPOINTS (Cần đăng nhập) ==========
    
    @PostMapping("/{id}/inquiry")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> incrementInquiry(@PathVariable UUID id) {
        petService.incrementInquiryCount(id);
        return ResponseEntity.ok(MessageResponse.builder()
                .message("Inquiry recorded")
                .success(true)
                .build());
    }

    @PostMapping("/{id}/favorite")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> addFavorite(@PathVariable UUID id) {
        petService.toggleFavorite(id, true);
        return ResponseEntity.ok(MessageResponse.builder()
                .message("Added to favorites")
                .success(true)
                .build());
    }

    @DeleteMapping("/{id}/favorite")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> removeFavorite(@PathVariable UUID id) {
        petService.toggleFavorite(id, false);
        return ResponseEntity.ok(MessageResponse.builder()
                .message("Removed from favorites")
                .success(true)
                .build());
    }
}
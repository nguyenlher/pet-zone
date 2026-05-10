package com.petstore.petservice.api.controller.publ;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.petstore.petservice.api.dto.request.Pet3DModelSaveRequest;
import com.petstore.petservice.api.dto.response.Pet3DModelResponse;
import com.petstore.petservice.api.dto.response.PetDetailResponse;
import com.petstore.petservice.api.dto.response.PetResponse;
import com.petstore.petservice.domain.model.enums.PetStatus;
import com.petstore.petservice.domain.service.PetService;
import com.petstore.petservice.utils.PetApiPath;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(PetApiPath.PET_PUBLIC_BASE)
@RequiredArgsConstructor
public class PublicPetController {

    private final PetService petService;

    @GetMapping(PetApiPath.PET_PUBLIC_BY_ID)
    public ResponseEntity<PetDetailResponse> getPetById(@PathVariable UUID petId) {
        return ResponseEntity.ok(petService.getById(petId));
    }

    @GetMapping(PetApiPath.PET_PUBLIC_BY_STATUS)
    public ResponseEntity<Page<PetResponse>> getPetsByStatus(
            @PathVariable PetStatus status,
            @PageableDefault(size = 12, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(petService.getByStatus(status, pageable));
    }

    @GetMapping
    public ResponseEntity<Page<PetResponse>> getAllPets(
            @PageableDefault(size = 12, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(petService.getAll(pageable));
    }

    @PostMapping(PetApiPath.PET_PUBLIC_INCREMENT_VIEW)
    public ResponseEntity<Void> incrementViewCount(@PathVariable UUID petId) {
        petService.incrementViewCount(petId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/3d-model")
    public ResponseEntity<Pet3DModelResponse> save3DModel(@Valid @RequestBody Pet3DModelSaveRequest request) {
        return ResponseEntity.ok(petService.save3DModel(request));
    }
}

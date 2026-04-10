package com.petstore.petservice.controller.publ;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.petstore.petservice.dto.response.PetTypeResponse;
import com.petstore.petservice.service.PetTypeService;
import com.petstore.petservice.utils.PetApiPath;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(PetApiPath.PET_TYPE_PUBLIC_BASE)
@RequiredArgsConstructor
public class PublicPetTypeController {

    private final PetTypeService petTypeService;

    @GetMapping
    public ResponseEntity<List<PetTypeResponse>> getAllPetTypes() {
        return ResponseEntity.ok(petTypeService.getAll());
    }

    @GetMapping(PetApiPath.PET_TYPE_PUBLIC_ACTIVE)
    public ResponseEntity<List<PetTypeResponse>> getActivePetTypes() {
        return ResponseEntity.ok(petTypeService.getAllActive());
    }

    @GetMapping(PetApiPath.PET_TYPE_PUBLIC_BY_ID)
    public ResponseEntity<PetTypeResponse> getPetTypeById(@PathVariable UUID typeId) {
        return ResponseEntity.ok(petTypeService.getById(typeId));
    }
}

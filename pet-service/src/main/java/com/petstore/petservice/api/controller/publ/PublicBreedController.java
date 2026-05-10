package com.petstore.petservice.api.controller.publ;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.petstore.petservice.api.dto.response.BreedResponse;
import com.petstore.petservice.domain.service.BreedService;
import com.petstore.petservice.utils.PetApiPath;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(PetApiPath.BREED_PUBLIC_BASE)
@RequiredArgsConstructor
public class PublicBreedController {

    private final BreedService breedService;

    @GetMapping
    public ResponseEntity<List<BreedResponse>> getAllBreeds() {
        return ResponseEntity.ok(breedService.getAll());
    }

    @GetMapping(PetApiPath.BREED_PUBLIC_BY_ID)
    public ResponseEntity<BreedResponse> getBreedById(@PathVariable UUID breedId) {
        return ResponseEntity.ok(breedService.getById(breedId));
    }

    @GetMapping(PetApiPath.BREED_PUBLIC_BY_TYPE)
    public ResponseEntity<List<BreedResponse>> getBreedsByPetType(@PathVariable UUID typeId) {
        return ResponseEntity.ok(breedService.getByPetTypeId(typeId));
    }
}

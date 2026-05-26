package com.petstore.petservice.api.controller.priv;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.petstore.petservice.api.dto.response.PetDetailResponse;
import com.petstore.petservice.domain.service.PetService;
import com.petstore.petservice.utils.PetApiPath;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Private Pet Controller for inter-service communication
 * Used by other microservices (order-service, etc.) to get pet information
 */
@RestController
@RequestMapping(PetApiPath.PET_PRIVATE_BASE)
@RequiredArgsConstructor
@Slf4j
public class PrivatePetController {

    private final PetService petService;

    @GetMapping(PetApiPath.PET_PRIVATE_BY_ID)
    public ResponseEntity<PetDetailResponse> getPetById(@PathVariable UUID petId) {
        log.info("Private API: Getting pet by id: {}", petId);
        return ResponseEntity.ok(petService.getById(petId));
    }
}

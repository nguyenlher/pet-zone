package com.petstore.petservice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.petstore.petservice.dto.response.BreedResponse;
import com.petstore.petservice.model.enums.PetType;
import com.petstore.petservice.service.BreedService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/breeds")
@RequiredArgsConstructor
public class BreedController {

    private final BreedService breedService;

    @GetMapping("/public")
    public ResponseEntity<List<BreedResponse>> getBreedsByType(@RequestParam PetType petType) {
        return ResponseEntity.ok(breedService.getBreedsByType(petType));
    }
}

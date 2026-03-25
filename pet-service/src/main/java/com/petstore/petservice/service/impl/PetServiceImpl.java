package com.petstore.petservice.service.impl;

import com.petstore.petservice.dto.request.PetCreateRequest;
import com.petstore.petservice.dto.request.PetSearchRequest;
import com.petstore.petservice.dto.request.PetUpdateRequest;
import com.petstore.petservice.dto.response.PetDetailResponse;
import com.petstore.petservice.dto.response.PetResponse;
import com.petstore.petservice.entity.PetEntity;
import com.petstore.petservice.enums.PetStatus;
import com.petstore.petservice.enums.PetType;
import com.petstore.petservice.exception.ResourceNotFoundException;
import com.petstore.petservice.mapper.PetMapper;
import com.petstore.petservice.model.Pet;
import com.petstore.petservice.repository.PetRepository;
import com.petstore.petservice.repository.jpa.JpaPetRepository;
import com.petstore.petservice.service.PetService;
import com.petstore.petservice.specification.PetSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PetServiceImpl implements PetService {
    
    private final PetRepository petRepository;
    private final JpaPetRepository jpaPetRepository;
    private final PetMapper petMapper;
    
    @Override
    @Transactional
    public PetDetailResponse createPet(PetCreateRequest request, String username) {
        log.info("Creating new pet by user: {}", username);
        
        Pet pet = Pet.builder()
                .name(request.getName())
                .petType(request.getPetType())
                .breedId(request.getBreedId())
                .gender(request.getGender())
                .birthDate(request.getBirthDate())
                .weight(request.getWeight())
                .height(request.getHeight())
                .colors(request.getColors())
                .colorPattern(request.getColorPattern())
                .furType(request.getFurType())
                .healthStatus(request.getHealthStatus())
                .vaccinated(request.getVaccinated())
                .price(request.getPrice())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : PetStatus.DRAFT)
                .thumbnailUrl(request.getThumbnailUrl())
                .imageUrls(request.getImageUrls())
                .viewCount(0)
                .build();
        
        Pet savedPet = petRepository.save(pet);
        log.info("Pet created with ID: {}", savedPet.getId());
        
        return mapToDetailResponse(savedPet);
    }
    
    @Override
    @Transactional
    public PetDetailResponse updatePet(UUID id, PetUpdateRequest request, String username) {
        log.info("Updating pet ID: {} by user: {}", id, username);
        
        Pet existingPet = petRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found with ID: " + id));
        
        if (request.getName() != null) existingPet.setName(request.getName());
        if (request.getBreedId() != null) existingPet.setBreedId(request.getBreedId());
        if (request.getWeight() != null) existingPet.setWeight(request.getWeight());
        if (request.getHeight() != null) existingPet.setHeight(request.getHeight());
        if (request.getColors() != null) existingPet.setColors(request.getColors());
        if (request.getColorPattern() != null) existingPet.setColorPattern(request.getColorPattern());
        if (request.getFurType() != null) existingPet.setFurType(request.getFurType());
        if (request.getHealthStatus() != null) existingPet.setHealthStatus(request.getHealthStatus());
        if (request.getVaccinated() != null) existingPet.setVaccinated(request.getVaccinated());
        if (request.getPrice() != null) existingPet.setPrice(request.getPrice());
        if (request.getDescription() != null) existingPet.setDescription(request.getDescription());
        if (request.getStatus() != null) existingPet.setStatus(request.getStatus());
        if (request.getThumbnailUrl() != null) existingPet.setThumbnailUrl(request.getThumbnailUrl());
        if (request.getImageUrls() != null) existingPet.setImageUrls(request.getImageUrls());
        
        Pet updatedPet = petRepository.save(existingPet);
        log.info("Pet updated successfully: {}", id);
        
        return mapToDetailResponse(updatedPet);
    }
    
    @Override
    @Transactional
    public void deletePet(UUID id) {
        log.info("Deleting pet ID: {}", id);
        
        if (!petRepository.existsById(id)) {
            throw new ResourceNotFoundException("Pet not found with ID: " + id);
        }
        
        petRepository.deleteById(id);
        log.info("Pet deleted successfully: {}", id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<PetResponse> getAllAvailablePets(Pageable pageable) {
        Page<Pet> petPage = petRepository.findByStatus(PetStatus.AVAILABLE, pageable);
        return petPage.map(this::mapToResponse);
    }
    
    @Override
    @Transactional
    public PetDetailResponse getPetById(UUID id) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found with ID: " + id));
        
        return mapToDetailResponse(pet);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<PetResponse> searchPets(PetSearchRequest request, Pageable pageable) {
        var specification = PetSpecification.withFilters(request);
        Page<PetEntity> petPage = jpaPetRepository.findAll(specification, pageable);
        
        return petPage.map(entity -> mapToResponse(petMapper.toDomain(entity)));
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<PetResponse> getPetsByType(PetType petType, Pageable pageable) {
        Page<Pet> petPage = petRepository.findByPetType(petType, pageable);
        return petPage.map(this::mapToResponse);
    }
    
    @Override
    @Transactional
    public void incrementViewCount(UUID id) {
        jpaPetRepository.incrementViewCount(id);
    }
    
    @Override
    @Transactional
    public void incrementInquiryCount(UUID id) {
        // Có thể implement sau nếu cần
        log.info("Inquiry recorded for pet: {}", id);
    }
    
    private PetResponse mapToResponse(Pet pet) {
        return PetResponse.builder()
                .id(pet.getId())
                .name(pet.getName())
                .petType(pet.getPetType())
                .gender(pet.getGender())
                .ageInMonths(calculateAgeInMonths(pet.getBirthDate()))
                .weight(pet.getWeight())
                .colors(pet.getColors())
                .price(pet.getPrice())
                .status(pet.getStatus())
                .viewCount(pet.getViewCount())
                .thumbnailUrl(pet.getThumbnailUrl())
                .has3DModel(false) // Sẽ update sau khi có 3D model service
                .createdAt(pet.getCreatedAt())
                .build();
    }
    
    private PetDetailResponse mapToDetailResponse(Pet pet) {
        return PetDetailResponse.builder()
                .id(pet.getId())
                .name(pet.getName())
                .petType(pet.getPetType())
                .breedId(pet.getBreedId())
                .gender(pet.getGender())
                .birthDate(pet.getBirthDate())
                .ageInMonths(calculateAgeInMonths(pet.getBirthDate()))
                .weight(pet.getWeight())
                .height(pet.getHeight())
                .colors(pet.getColors())
                .colorPattern(pet.getColorPattern())
                .furType(pet.getFurType())
                .healthStatus(pet.getHealthStatus())
                .vaccinated(pet.getVaccinated())
                .price(pet.getPrice())
                .description(pet.getDescription())
                .status(pet.getStatus())
                .thumbnailUrl(pet.getThumbnailUrl())
                .imageUrls(pet.getImageUrls())
                .aiDescription(pet.getAiDescription())
                .viewCount(pet.getViewCount())
                .createdAt(pet.getCreatedAt())
                .updatedAt(pet.getUpdatedAt())
                .build();
    }
    
    private Integer calculateAgeInMonths(LocalDate birthDate) {
        if (birthDate == null) return null;
        Period period = Period.between(birthDate, LocalDate.now());
        return period.getYears() * 12 + period.getMonths();
    }
}
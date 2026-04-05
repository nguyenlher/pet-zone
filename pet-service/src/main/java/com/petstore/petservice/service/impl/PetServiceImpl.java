package com.petstore.petservice.service.impl;

import com.petstore.petservice.dto.request.PetCreateRequest;
import com.petstore.petservice.dto.request.PetSearchRequest;
import com.petstore.petservice.dto.request.PetUpdateRequest;
import com.petstore.petservice.dto.response.BreedResponse;
import com.petstore.petservice.dto.response.PetDetailResponse;
import com.petstore.petservice.dto.response.PetImageResponse;
import com.petstore.petservice.dto.response.PetResponse;
import com.petstore.petservice.entity.BreedEntity;
import com.petstore.petservice.entity.PetEntity;
import com.petstore.petservice.entity.PetImageEntity;
import com.petstore.petservice.exception.ResourceNotFoundException;
import com.petstore.petservice.model.enums.PetStatus;
import com.petstore.petservice.repository.jpa.JpaBreedRepository;
import com.petstore.petservice.repository.jpa.JpaPetImageRepository;
import com.petstore.petservice.repository.jpa.JpaPetRepository;
import com.petstore.petservice.service.PetService;
import com.petstore.petservice.specification.PetSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PetServiceImpl implements PetService {
    
    private final JpaPetRepository jpaPetRepository;
    private final JpaBreedRepository jpaBreedRepository;
    private final JpaPetImageRepository jpaPetImageRepository;
    
    @Override
    @Transactional
    public PetDetailResponse createPet(PetCreateRequest request, String username) {
        log.info("Creating new pet by user: {}", username);
        
        // Check breed exists
        BreedEntity breed = jpaBreedRepository.findById(request.getBreedId())
                .orElseThrow(() -> new ResourceNotFoundException("Breed not found with ID: " + request.getBreedId()));
        
        PetEntity pet = new PetEntity();
        pet.setName(request.getName());
        pet.setBreedId(request.getBreedId());
        pet.setGender(request.getGender());
        pet.setBirthDate(request.getBirthDate());
        pet.setWeight(request.getWeight());
        pet.setHeight(request.getHeight());
        pet.setColors(request.getColors());
        pet.setFurType(request.getFurType());
        pet.setHealthStatus(request.getHealthStatus());
        pet.setVaccinated(request.getVaccinated());
        pet.setPrice(request.getPrice());
        pet.setDescription(request.getDescription());
        pet.setStatus(request.getStatus() != null ? request.getStatus() : PetStatus.DRAFT);
        pet.setViewCount(0);
        
        PetEntity savedPet = jpaPetRepository.save(pet);
        log.info("Pet created with ID: {}", savedPet.getId());
        
        return mapToDetailResponse(savedPet, breed);
    }
    
    @Override
    @Transactional
    public PetDetailResponse updatePet(UUID id, PetUpdateRequest request, String username) {
        log.info("Updating pet ID: {} by user: {}", id, username);
        
        PetEntity pet = jpaPetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found with ID: " + id));
        
        if (request.getName() != null) pet.setName(request.getName());
        if (request.getBreedId() != null) {
            // Check breed exists
            BreedEntity breed = jpaBreedRepository.findById(request.getBreedId())
                    .orElseThrow(() -> new ResourceNotFoundException("Breed not found with ID: " + request.getBreedId()));
            pet.setBreedId(request.getBreedId());
        }
        if (request.getBirthDate() != null) pet.setBirthDate(request.getBirthDate());
        if (request.getWeight() != null) pet.setWeight(request.getWeight());
        if (request.getHeight() != null) pet.setHeight(request.getHeight());
        if (request.getColors() != null) pet.setColors(request.getColors());
        if (request.getFurType() != null) pet.setFurType(request.getFurType());
        if (request.getHealthStatus() != null) pet.setHealthStatus(request.getHealthStatus());
        if (request.getVaccinated() != null) pet.setVaccinated(request.getVaccinated());
        if (request.getPrice() != null) pet.setPrice(request.getPrice());
        if (request.getDescription() != null) pet.setDescription(request.getDescription());
        if (request.getStatus() != null) pet.setStatus(request.getStatus());
        
        PetEntity updatedPet = jpaPetRepository.save(pet);
        log.info("Pet updated successfully: {}", id);
        
        BreedEntity breed = jpaBreedRepository.findById(updatedPet.getBreedId()).orElse(null);
        return mapToDetailResponse(updatedPet, breed);
    }
    
    @Override
    @Transactional
    public void deletePet(UUID id) {
        log.info("Deleting pet ID: {}", id);
        
        if (!jpaPetRepository.existsById(id)) {
            throw new ResourceNotFoundException("Pet not found with ID: " + id);
        }
        
        jpaPetRepository.deleteById(id);
        log.info("Pet deleted successfully: {}", id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<PetResponse> getAllAvailablePets(Pageable pageable) {
        Page<PetEntity> petPage = jpaPetRepository.findByStatus(PetStatus.AVAILABLE, pageable);
        return petPage.map(this::mapToResponse);
    }
    
    @Override
    @Transactional
    public PetDetailResponse getPetById(UUID id) {
        PetEntity pet = jpaPetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found with ID: " + id));
        
        BreedEntity breed = jpaBreedRepository.findById(pet.getBreedId()).orElse(null);
        return mapToDetailResponse(pet, breed);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<PetResponse> searchPets(PetSearchRequest request, Pageable pageable) {
        // Set default status to AVAILABLE if not specified
        if (request.getStatus() == null) {
            request.setStatus(PetStatus.AVAILABLE);
        }
        
        var specification = PetSpecification.withFilters(request);
        Page<PetEntity> petPage = jpaPetRepository.findAll(specification, pageable);
        
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
    
    private PetResponse mapToResponse(PetEntity pet) {
        // Get thumbnail from images
        String thumbnailUrl = null;
        List<PetImageEntity> images = jpaPetImageRepository.findByPetIdOrderBySortOrderAsc(pet.getId());
        if (images != null && !images.isEmpty()) {
            PetImageEntity thumbnail = images.stream()
                    .filter(PetImageEntity::getIsThumbnail)
                    .findFirst()
                    .orElse(images.get(0));
            thumbnailUrl = thumbnail.getImageUrl();
        }
        
        return PetResponse.builder()
                .id(pet.getId())
                .name(pet.getName())
                .breedName(getBreedName(pet.getBreedId()))
                .gender(pet.getGender())
                .ageInMonths(calculateAgeInMonths(pet.getBirthDate()))
                .weight(pet.getWeight())
                .colors(pet.getColors())
                .price(pet.getPrice())
                .status(pet.getStatus())
                .viewCount(pet.getViewCount())
                .thumbnailUrl(thumbnailUrl)
                .has3DModel(false)
                .createdAt(pet.getCreatedAt())
                .build();
    }
    
    private PetDetailResponse mapToDetailResponse(PetEntity pet, BreedEntity breed) {
        // Get images
        List<PetImageEntity> images = jpaPetImageRepository.findByPetIdOrderBySortOrderAsc(pet.getId());
        List<PetImageResponse> imageResponses = images.stream()
                .map(this::mapToImageResponse)
                .collect(Collectors.toList());
        
        // Map breed response
        BreedResponse breedResponse = null;
        if (breed != null) {
            breedResponse = BreedResponse.builder()
                    .id(breed.getId())
                    .name(breed.getName())
                    .petType(breed.getPetType())
                    .description(breed.getDescription())
                    .avgRating(breed.getAvgRating())
                    .totalReviews(breed.getTotalReviews())
                    .imageUrl(breed.getImageUrl())
                    .isActive(breed.getIsActive())
                    .createdAt(breed.getCreatedAt())
                    .updatedAt(breed.getUpdatedAt())
                    .build();
        }
        
        return PetDetailResponse.builder()
                .id(pet.getId())
                .name(pet.getName())
                .breedId(pet.getBreedId())
                .breedName(breed != null ? breed.getName() : null)
                .breed(breedResponse)
                .gender(pet.getGender())
                .birthDate(pet.getBirthDate())
                .ageInMonths(calculateAgeInMonths(pet.getBirthDate()))
                .weight(pet.getWeight())
                .height(pet.getHeight())
                .colors(pet.getColors())
                .furType(pet.getFurType())
                .healthStatus(pet.getHealthStatus())
                .vaccinated(pet.getVaccinated())
                .price(pet.getPrice())
                .description(pet.getDescription())
                .status(pet.getStatus())
                .images(imageResponses)
                .viewCount(pet.getViewCount())
                .createdAt(pet.getCreatedAt())
                .updatedAt(pet.getUpdatedAt())
                .build();
    }
    
    private PetImageResponse mapToImageResponse(PetImageEntity image) {
        return PetImageResponse.builder()
                .id(image.getId())
                .imageUrl(image.getImageUrl())
                .isThumbnail(image.getIsThumbnail())
                .sortOrder(image.getSortOrder())
                .createdAt(image.getCreatedAt())
                .build();
    }
    
    private String getBreedName(UUID breedId) {
        if (breedId == null) return null;
        return jpaBreedRepository.findById(breedId)
                .map(BreedEntity::getName)
                .orElse(null);
    }
    
    private Integer calculateAgeInMonths(LocalDate birthDate) {
        if (birthDate == null) return null;
        Period period = Period.between(birthDate, LocalDate.now());
        return period.getYears() * 12 + period.getMonths();
    }
}
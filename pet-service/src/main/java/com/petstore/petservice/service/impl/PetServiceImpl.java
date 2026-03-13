package com.petstore.petservice.service.impl;

import com.petstore.petservice.dto.request.PetCreateRequest;
import com.petstore.petservice.dto.request.PetSearchRequest;
import com.petstore.petservice.dto.request.PetUpdateRequest;
import com.petstore.petservice.dto.response.PetDetailResponse;
import com.petstore.petservice.dto.response.PetResponse;
import com.petstore.petservice.entity.PetEntity;
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

import java.util.List;
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
                .breedPrimaryId(request.getBreedPrimaryId())
                .breedSecondaryId(request.getBreedSecondaryId())
                .gender(request.getGender())
                .birthDate(request.getBirthDate())
                .birthDateAccuracy(request.getBirthDateAccuracy())
                .weight(request.getWeight())
                .height(request.getHeight())
                .length(request.getLength())
                .colors(request.getColors())
                .colorPattern(request.getColorPattern())
                .furType(request.getFurType())
                .faceShape(request.getFaceShape())
                .eyeColor(request.getEyeColor())
                .eyeShape(request.getEyeShape())
                .earType(request.getEarType())
                .muzzleLength(request.getMuzzleLength())
                .bodyShape(request.getBodyShape())
                .legLength(request.getLegLength())
                .tailType(request.getTailType())
                .distinctiveFeatures(request.getDistinctiveFeatures())
                .healthStatus(request.getHealthStatus())
                .spayedNeutered(request.getSpayedNeutered())
                .vaccinated(request.getVaccinated())
                .dewormed(request.getDewormed())
                .lastCheckupDate(request.getLastCheckupDate())
                .allergies(request.getAllergies())
                .chronicConditions(request.getChronicConditions())
                .energyLevel(request.getEnergyLevel())
                .sociability(request.getSociability())
                .childFriendly(request.getChildFriendly())
                .petFriendly(request.getPetFriendly())
                .trainability(request.getTrainability())
                .barkingTendency(request.getBarkingTendency())
                .separationAnxiety(request.getSeparationAnxiety())
                .commands(request.getCommands())
                .favoriteActivities(request.getFavoriteActivities())
                .price(request.getPrice())
                .originalPrice(request.getOriginalPrice())
                .negotiable(request.getNegotiable())
                .availableFrom(request.getAvailableFrom())
                .availableTo(request.getAvailableTo())
                .city(request.getCity())
                .district(request.getDistrict())
                .addressDetail(request.getAddressDetail())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .status(request.getStatus() != null ? request.getStatus() : "available")
                .isFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false)
                .featuredUntil(request.getFeaturedUntil())
                .promotionBadges(request.getPromotionBadges())
                .modelSourceImageUrl(request.getModelSourceImageUrl())
                .viewCount(0)
                .favoriteCount(0)
                .inquiryCount(0)
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
        
        // Update only non-null fields
        if (request.getName() != null) existingPet.setName(request.getName());
        if (request.getBreedPrimaryId() != null) existingPet.setBreedPrimaryId(request.getBreedPrimaryId());
        if (request.getBreedSecondaryId() != null) existingPet.setBreedSecondaryId(request.getBreedSecondaryId());
        if (request.getWeight() != null) existingPet.setWeight(request.getWeight());
        if (request.getHeight() != null) existingPet.setHeight(request.getHeight());
        if (request.getLength() != null) existingPet.setLength(request.getLength());
        if (request.getColors() != null) existingPet.setColors(request.getColors());
        if (request.getColorPattern() != null) existingPet.setColorPattern(request.getColorPattern());
        if (request.getFurType() != null) existingPet.setFurType(request.getFurType());
        if (request.getFaceShape() != null) existingPet.setFaceShape(request.getFaceShape());
        if (request.getEyeColor() != null) existingPet.setEyeColor(request.getEyeColor());
        if (request.getEyeShape() != null) existingPet.setEyeShape(request.getEyeShape());
        if (request.getEarType() != null) existingPet.setEarType(request.getEarType());
        if (request.getMuzzleLength() != null) existingPet.setMuzzleLength(request.getMuzzleLength());
        if (request.getBodyShape() != null) existingPet.setBodyShape(request.getBodyShape());
        if (request.getLegLength() != null) existingPet.setLegLength(request.getLegLength());
        if (request.getTailType() != null) existingPet.setTailType(request.getTailType());
        if (request.getDistinctiveFeatures() != null) existingPet.setDistinctiveFeatures(request.getDistinctiveFeatures());
        if (request.getHealthStatus() != null) existingPet.setHealthStatus(request.getHealthStatus());
        if (request.getSpayedNeutered() != null) existingPet.setSpayedNeutered(request.getSpayedNeutered());
        if (request.getVaccinated() != null) existingPet.setVaccinated(request.getVaccinated());
        if (request.getDewormed() != null) existingPet.setDewormed(request.getDewormed());
        if (request.getLastCheckupDate() != null) existingPet.setLastCheckupDate(request.getLastCheckupDate());
        if (request.getAllergies() != null) existingPet.setAllergies(request.getAllergies());
        if (request.getChronicConditions() != null) existingPet.setChronicConditions(request.getChronicConditions());
        if (request.getEnergyLevel() != null) existingPet.setEnergyLevel(request.getEnergyLevel());
        if (request.getSociability() != null) existingPet.setSociability(request.getSociability());
        if (request.getChildFriendly() != null) existingPet.setChildFriendly(request.getChildFriendly());
        if (request.getPetFriendly() != null) existingPet.setPetFriendly(request.getPetFriendly());
        if (request.getTrainability() != null) existingPet.setTrainability(request.getTrainability());
        if (request.getBarkingTendency() != null) existingPet.setBarkingTendency(request.getBarkingTendency());
        if (request.getSeparationAnxiety() != null) existingPet.setSeparationAnxiety(request.getSeparationAnxiety());
        if (request.getCommands() != null) existingPet.setCommands(request.getCommands());
        if (request.getFavoriteActivities() != null) existingPet.setFavoriteActivities(request.getFavoriteActivities());
        if (request.getPrice() != null) existingPet.setPrice(request.getPrice());
        if (request.getOriginalPrice() != null) existingPet.setOriginalPrice(request.getOriginalPrice());
        if (request.getNegotiable() != null) existingPet.setNegotiable(request.getNegotiable());
        if (request.getAvailableFrom() != null) existingPet.setAvailableFrom(request.getAvailableFrom());
        if (request.getAvailableTo() != null) existingPet.setAvailableTo(request.getAvailableTo());
        if (request.getCity() != null) existingPet.setCity(request.getCity());
        if (request.getDistrict() != null) existingPet.setDistrict(request.getDistrict());
        if (request.getAddressDetail() != null) existingPet.setAddressDetail(request.getAddressDetail());
        if (request.getLatitude() != null) existingPet.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) existingPet.setLongitude(request.getLongitude());
        if (request.getStatus() != null) existingPet.setStatus(request.getStatus());
        if (request.getIsFeatured() != null) existingPet.setIsFeatured(request.getIsFeatured());
        if (request.getFeaturedUntil() != null) existingPet.setFeaturedUntil(request.getFeaturedUntil());
        if (request.getPromotionBadges() != null) existingPet.setPromotionBadges(request.getPromotionBadges());
        
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
        Page<PetEntity> petPage = jpaPetRepository.findLatestAvailable(pageable);
        List<PetResponse> responses = petPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        
        return new PageImpl<>(responses, pageable, petPage.getTotalElements());
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
        // Sử dụng Specification để xây dựng query động
        var specification = PetSpecification.withFilters(request);
        Page<PetEntity> petPage = jpaPetRepository.findAll(specification, pageable);
        
        List<PetResponse> responses = petPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        
        return new PageImpl<>(responses, pageable, petPage.getTotalElements());
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<PetResponse> getFeaturedPets(Pageable pageable) {
        List<PetEntity> featuredPets = jpaPetRepository.findFeaturedPets();
        
        // Manual pagination (có thể tối ưu bằng query riêng)
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), featuredPets.size());
        
        List<PetResponse> responses = featuredPets.subList(start, end).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        
        return new PageImpl<>(responses, pageable, featuredPets.size());
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<PetResponse> getPetsByType(String petType, Pageable pageable) {
        Page<PetEntity> petPage = jpaPetRepository.findByPetType(petType, pageable);
        List<PetResponse> responses = petPage.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        
        return new PageImpl<>(responses, pageable, petPage.getTotalElements());
    }
    
    @Override
    @Transactional
    public void incrementViewCount(UUID id) {
        jpaPetRepository.incrementViewCount(id);
    }
    
    @Override
    @Transactional
    public void incrementInquiryCount(UUID id) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found with ID: " + id));
        pet.setInquiryCount(pet.getInquiryCount() + 1);
        petRepository.save(pet);
    }
    
    @Override
    @Transactional
    public void toggleFavorite(UUID id, boolean increment) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found with ID: " + id));
        
        if (increment) {
            pet.setFavoriteCount(pet.getFavoriteCount() + 1);
        } else {
            pet.setFavoriteCount(Math.max(0, pet.getFavoriteCount() - 1));
        }
        
        petRepository.save(pet);
    }
    
    // Helper methods để map entity/model sang response
    private PetResponse mapToResponse(PetEntity entity) {
        // TODO: Implement mapping logic
        return PetResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .petType(entity.getPetType())
                .gender(entity.getGender())
                .weight(entity.getWeight())
                .colors(entity.getColors())
                .price(entity.getPrice())
                .city(entity.getCity())
                .status(entity.getStatus())
                .isFeatured(entity.getIsFeatured())
                .viewCount(entity.getViewCount())
                .favoriteCount(entity.getFavoriteCount())
                .has3DModel(entity.getModel3dUrlGlb() != null)
                .createdAt(entity.getCreatedAt())
                .build();
    }
    
    private PetDetailResponse mapToDetailResponse(Pet pet) {
        // TODO: Implement full mapping logic
        PetDetailResponse response = new PetDetailResponse();
        // Map các trường từ pet sang response
        return response;
    }
}
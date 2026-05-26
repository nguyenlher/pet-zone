package com.petstore.petservice.infra.mapper;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.UUID;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.petstore.petservice.api.dto.request.PetCreateRequest;
import com.petstore.petservice.api.dto.request.PetUpdateRequest;
import com.petstore.petservice.api.dto.response.PetDetailResponse;
import com.petstore.petservice.api.dto.response.PetResponse;
import com.petstore.petservice.infra.entity.PetEntity;
import com.petstore.petservice.domain.model.Pet;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {PetProductImageMapper.class, Pet3DModelMapper.class, BreedMapper.class})
public interface PetMapper {
    PetEntity toEntity(Pet pet);
    Pet toDomain(PetEntity entity);
    List<PetEntity> toEntityList(List<Pet> pets);
    List<Pet> toDomainList(List<PetEntity> entities);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "viewCount", constant = "0")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Pet toDomain(PetCreateRequest request);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "viewCount", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateDomain(@MappingTarget Pet pet, PetUpdateRequest request);
    
    @Mapping(target = "ageInMonths", expression = "java(calculateAgeInMonths(pet.getBirthDate()))")
    @Mapping(target = "breed", ignore = true)
    @Mapping(target = "breedName", ignore = true)
    @Mapping(target = "petTypeId", ignore = true)
    @Mapping(target = "petTypeName", ignore = true)
    PetDetailResponse toDetailResponse(Pet pet);
    
    @Mapping(target = "id", source = "id")
    @Mapping(target = "ageInMonths", expression = "java(calculateAgeInMonths(pet.getBirthDate()))")
    @Mapping(target = "breedName", ignore = true)
    @Mapping(target = "petTypeId", ignore = true)
    @Mapping(target = "petTypeName", ignore = true)
    @Mapping(target = "thumbnailUrl", expression = "java(getThumbnailUrl(pet))")
    @Mapping(target = "has3DModel", expression = "java(pet.getModel3d() != null)")
    PetResponse toResponse(Pet pet);
    
    // Overloaded methods with breedName parameter
    default PetDetailResponse toDetailResponseWithBreed(Pet pet, String breedName) {
        PetDetailResponse response = toDetailResponse(pet);
        response.setBreedName(breedName);
        return response;
    }
    
    default PetDetailResponse toDetailResponseWithBreedAndType(Pet pet, String breedName, String petTypeName) {
        PetDetailResponse response = toDetailResponse(pet);
        response.setBreedName(breedName);
        response.setPetTypeName(petTypeName);
        return response;
    }
    
    default PetDetailResponse toDetailResponseWithBreedAndType(Pet pet, UUID petTypeId, String breedName, String petTypeName) {
        PetDetailResponse response = toDetailResponse(pet);
        response.setPetTypeId(petTypeId);
        response.setBreedName(breedName);
        response.setPetTypeName(petTypeName);
        return response;
    }
    
    default PetResponse toResponseWithBreed(Pet pet, String breedName) {
        PetResponse response = toResponse(pet);
        response.setBreedName(breedName);
        return response;
    }
    
    default PetResponse toResponseWithBreedAndType(Pet pet, String breedName, String petTypeName) {
        PetResponse response = toResponse(pet);
        response.setBreedName(breedName);
        response.setPetTypeName(petTypeName);
        return response;
    }

    default PetResponse toResponseWithBreedAndType(Pet pet, UUID petTypeId, String breedName, String petTypeName) {
        PetResponse response = toResponse(pet);
        response.setPetTypeId(petTypeId);
        response.setBreedName(breedName);
        response.setPetTypeName(petTypeName);
        return response;
    }
    
    default Integer calculateAgeInMonths(LocalDate birthDate) {
        if (birthDate == null) {
            return null;
        }
        return Period.between(birthDate, LocalDate.now()).getYears() * 12 
             + Period.between(birthDate, LocalDate.now()).getMonths();
    }
    
    default String getThumbnailUrl(Pet pet) {
        if (pet.getImages() == null || pet.getImages().isEmpty()) {
            return null;
        }
        return pet.getImages().stream()
                .filter(img -> img.getIsThumbnail() != null && img.getIsThumbnail())
                .findFirst()
                .map(img -> img.getImageUrl())
                .orElse(pet.getImages().get(0).getImageUrl());
    }
}

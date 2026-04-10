package com.petstore.petservice.mapper;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.petstore.petservice.dto.request.PetCreateRequest;
import com.petstore.petservice.dto.request.PetUpdateRequest;
import com.petstore.petservice.dto.response.PetDetailResponse;
import com.petstore.petservice.dto.response.PetResponse;
import com.petstore.petservice.entity.PetEntity;
import com.petstore.petservice.model.Pet;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        uses = {PetImageMapper.class, Pet3DModelMapper.class, BreedMapper.class})
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
    @Mapping(target = "images", ignore = true)
    @Mapping(target = "model3d", ignore = true)
    PetDetailResponse toDetailResponse(Pet pet);
    
    @Mapping(target = "ageInMonths", expression = "java(calculateAgeInMonths(pet.getBirthDate()))")
    @Mapping(target = "breedName", ignore = true)
    @Mapping(target = "thumbnailUrl", ignore = true)
    @Mapping(target = "has3DModel", constant = "false")
    PetResponse toResponse(Pet pet);
    
    default Integer calculateAgeInMonths(LocalDate birthDate) {
        if (birthDate == null) {
            return null;
        }
        return Period.between(birthDate, LocalDate.now()).getYears() * 12 
             + Period.between(birthDate, LocalDate.now()).getMonths();
    }
}

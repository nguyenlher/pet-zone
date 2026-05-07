package com.petstore.petservice.infra.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.petstore.petservice.domain.model.PetProduct;
import com.petstore.petservice.domain.model.enums.ProductCategory;
import com.petstore.petservice.domain.model.enums.ProductStatus;
import com.petstore.petservice.domain.repository.PetProductRepository;
import com.petstore.petservice.infra.mapper.PetProductMapper;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class PetProductRepositoryImpl implements PetProductRepository {
    
    private final PetProductJpaRepository jpaRepository;
    private final PetProductMapper mapper;
    
    @Override
    public PetProduct save(PetProduct petProduct) {
        var entity = mapper.toEntity(petProduct);
        var savedEntity = jpaRepository.save(entity);
        return mapper.toDomain(savedEntity);
    }
    
    @Override
    public Optional<PetProduct> findById(UUID id) {
        return jpaRepository.findById(id)
                .map(mapper::toDomain);
    }
    
    @Override
    public Page<PetProduct> findAll(Pageable pageable) {
        return jpaRepository.findAll(pageable)
                .map(mapper::toDomain);
    }
    
    @Override
    public Page<PetProduct> findByStatus(ProductStatus status, Pageable pageable) {
        return jpaRepository.findByStatus(status, pageable)
                .map(mapper::toDomain);
    }
    
    @Override
    public Page<PetProduct> findByCategory(ProductCategory category, Pageable pageable) {
        return jpaRepository.findByCategory(category, pageable)
                .map(mapper::toDomain);
    }
    
    @Override
    public Page<PetProduct> findByCategoryAndStatus(ProductCategory category, ProductStatus status, Pageable pageable) {
        return jpaRepository.findByCategoryAndStatus(category, status, pageable)
                .map(mapper::toDomain);
    }
    
    @Override
    public Page<PetProduct> findByPetTypeId(UUID petTypeId, Pageable pageable) {
        return jpaRepository.findByPetTypeId(petTypeId, pageable)
                .map(mapper::toDomain);
    }
    
    @Override
    public Page<PetProduct> searchByKeyword(String keyword, Pageable pageable) {
        return jpaRepository.searchByKeyword(keyword, pageable)
                .map(mapper::toDomain);
    }
    
    @Override
    public List<PetProduct> findTopSellingProducts(int limit) {
        return jpaRepository.findTopSellingProducts(ProductStatus.AVAILABLE, PageRequest.of(0, limit))
                .stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<PetProduct> findTopRatedProducts(int limit) {
        return jpaRepository.findTopRatedProducts(ProductStatus.AVAILABLE, PageRequest.of(0, limit))
                .stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public void deleteById(UUID id) {
        jpaRepository.deleteById(id);
    }
    
    @Override
    public boolean existsById(UUID id) {
        return jpaRepository.existsById(id);
    }
}

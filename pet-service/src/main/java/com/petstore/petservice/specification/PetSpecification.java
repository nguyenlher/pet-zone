package com.petstore.petservice.specification;

import com.petstore.petservice.dto.request.PetSearchRequest;
import com.petstore.petservice.entity.PetEntity;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class PetSpecification {

    public static Specification<PetEntity> withFilters(PetSearchRequest request) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Luôn chỉ lấy pet đang available
            predicates.add(cb.equal(root.get("status"), "available"));

            if (request.getKeyword() != null && !request.getKeyword().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("name")), 
                        "%" + request.getKeyword().toLowerCase() + "%"));
            }

            if (request.getPetType() != null) {
                predicates.add(cb.equal(root.get("petType"), request.getPetType()));
            }

            if (request.getBreedId() != null) {
                predicates.add(cb.or(
                        cb.equal(root.get("breedPrimaryId"), request.getBreedId()),
                        cb.equal(root.get("breedSecondaryId"), request.getBreedId())
                ));
            }

            if (request.getGender() != null) {
                predicates.add(cb.equal(root.get("gender"), request.getGender()));
            }

            if (request.getMinWeight() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("weight"), request.getMinWeight()));
            }

            if (request.getMaxWeight() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("weight"), request.getMaxWeight()));
            }

            if (request.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), request.getMinPrice()));
            }

            if (request.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), request.getMaxPrice()));
            }

            if (request.getCity() != null) {
                predicates.add(cb.equal(root.get("city"), request.getCity()));
            }

            if (request.getMinAge() != null) {
                LocalDate minBirthDate = LocalDate.now().minusMonths(request.getMaxAge());
                predicates.add(cb.lessThanOrEqualTo(root.get("birthDate"), minBirthDate));
            }

            if (request.getMaxAge() != null) {
                LocalDate maxBirthDate = LocalDate.now().minusMonths(request.getMinAge());
                predicates.add(cb.greaterThanOrEqualTo(root.get("birthDate"), maxBirthDate));
            }

            if (request.getColors() != null && request.getColors().length > 0) {
                // Tìm pet có ít nhất một trong các màu được chọn
                for (String color : request.getColors()) {
                    predicates.add(cb.isMember(color, root.get("colors")));
                }
            }

            if (request.getIsFeatured() != null && request.getIsFeatured()) {
                predicates.add(cb.isTrue(root.get("isFeatured")));
                predicates.add(cb.or(
                        cb.isNull(root.get("featuredUntil")),
                        cb.greaterThanOrEqualTo(root.get("featuredUntil"), LocalDate.now())
                ));
            }

            // Sorting
            if (request.getSortBy() != null) {
                if ("price".equals(request.getSortBy())) {
                    query.orderBy("asc".equals(request.getSortDirection()) 
                            ? cb.asc(root.get("price")) 
                            : cb.desc(root.get("price")));
                } else if ("createdAt".equals(request.getSortBy())) {
                    query.orderBy("asc".equals(request.getSortDirection()) 
                            ? cb.asc(root.get("createdAt")) 
                            : cb.desc(root.get("createdAt")));
                } else if ("viewCount".equals(request.getSortBy())) {
                    query.orderBy("asc".equals(request.getSortDirection()) 
                            ? cb.asc(root.get("viewCount")) 
                            : cb.desc(root.get("viewCount")));
                }
            } else {
                query.orderBy(cb.desc(root.get("createdAt")));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
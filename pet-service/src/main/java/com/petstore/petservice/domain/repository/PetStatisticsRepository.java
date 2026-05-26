package com.petstore.petservice.domain.repository;

import java.util.List;

public interface PetStatisticsRepository {
    Long countTotalPets();
    Long countPetsByStatus(String status);
    List<TopPetData> getTopViewedPets(int limit);
    
    record TopPetData(String id, String name, String imageUrl, Double price, Integer viewCount) {}
}

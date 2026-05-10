package com.petstore.statisticsservice.api.dto.response;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopPetResponse {
    private UUID id;
    private String name;
    private String imageUrl;
    private Double price;
    private Long quantitySold;
    private Double totalRevenue;
    private Integer rank;
}

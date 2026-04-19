package com.petstore.petservice.api.dto.request;

import com.petstore.petservice.domain.model.enums.FurType;
import com.petstore.petservice.domain.model.enums.HealthStatus;
import com.petstore.petservice.domain.model.enums.PetStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PetUpdateRequest {
    private String name;
    private UUID breedId;
    private LocalDate birthDate;
    private Double weight;
    private Double height;
    private List<String> colors;
    private FurType furType;
    private HealthStatus healthStatus;
    private Boolean vaccinated;
    private BigDecimal price;
    private String description;
    private PetStatus status;
}
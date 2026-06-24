package com.petstore.orderservice.api.dto.response;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter 
@Builder 
@NoArgsConstructor
@AllArgsConstructor
public class StockReservationResponse {
    private boolean success;
    private String message;
    private UUID productId;
    private Integer quantity;
}

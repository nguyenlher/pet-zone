package com.petstore.statisticsservice.api.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentMethodStatsResponse {
    private List<PaymentMethodData> data;
    private Double totalAmount;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentMethodData {
        private String paymentMethod;
        private Long transactionCount;
        private Double totalAmount;
        private Double percentage;
    }
}

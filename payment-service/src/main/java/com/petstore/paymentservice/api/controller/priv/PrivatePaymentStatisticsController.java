package com.petstore.paymentservice.api.controller.priv;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.petstore.paymentservice.api.dto.PaymentStatisticsDto;
import com.petstore.paymentservice.domain.service.PaymentStatisticsService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Private Payment Statistics Controller for inter-service communication
 * Used by statistics-service to get payment statistics data
 */
@RestController
@RequestMapping("/private/payments/statistics")
@RequiredArgsConstructor
@Slf4j
public class PrivatePaymentStatisticsController {

    private final PaymentStatisticsService paymentStatisticsService;

    @GetMapping
    public ResponseEntity<PaymentStatisticsDto> getPaymentStatistics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        log.info("Private API: Getting payment statistics from {} to {}", startDate, endDate);
        PaymentStatisticsDto statistics = paymentStatisticsService.getPaymentStatistics(startDate, endDate);
        return ResponseEntity.ok(statistics);
    }
}

package com.petstore.paymentservice.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.petstore.paymentservice.dto.request.CreatePaymentRequest;
import com.petstore.paymentservice.dto.response.PaymentCallbackResponse;
import com.petstore.paymentservice.dto.response.PaymentResponse;
import com.petstore.paymentservice.service.PaymentService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/public/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentResponse> createPayment(
            @RequestBody CreatePaymentRequest request,
            HttpServletRequest httpRequest) {

        String ipAddress = getClientIp(httpRequest);
        PaymentResponse response = paymentService.createPayment(request, ipAddress);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/callback/{paymentMethod}")
    public ResponseEntity<PaymentCallbackResponse> callback(
            @PathVariable String paymentMethod,
            @RequestParam Map<String, String> params) {

        log.info("{} return callback received: {}", paymentMethod, params);
        PaymentCallbackResponse response = paymentService.handleCallback(paymentMethod, params);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/ipn/{paymentMethod}")
    public ResponseEntity<PaymentCallbackResponse> ipn(
            @PathVariable String paymentMethod,
            @RequestParam Map<String, String> params) {

        log.info("{} IPN received: {}", paymentMethod, params);
        PaymentCallbackResponse response = paymentService.handleIpn(paymentMethod, params);
        return ResponseEntity.ok(response);
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}

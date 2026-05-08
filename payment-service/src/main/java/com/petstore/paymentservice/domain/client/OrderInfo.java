package com.petstore.paymentservice.domain.client;

import java.util.UUID;

public record OrderInfo(UUID orderId, UUID userId, double totalAmount) {}

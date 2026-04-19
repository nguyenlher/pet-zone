package com.petstore.paymentservice.domain.client;

import java.util.UUID;

public record OrderInfo(UUID id, UUID userId, double totalAmount) {}

package com.petstore.paymentservice.client;

import java.util.UUID;

public record OrderInfo(UUID id, UUID userId, double totalAmount) {}

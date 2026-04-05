package com.petstore.paymentservice.publisher.event;

import java.util.UUID;

public record SendNotificationEvent(UUID userId) {}

package com.petstore.paymentservice.infra.publisher.event;

import java.util.UUID;

public record SendNotificationEvent(UUID userId) {}

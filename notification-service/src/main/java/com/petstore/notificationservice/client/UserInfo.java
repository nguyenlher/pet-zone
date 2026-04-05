package com.petstore.notificationservice.client;

import java.util.UUID;

public record UserInfo(UUID id, String email, String name) {}

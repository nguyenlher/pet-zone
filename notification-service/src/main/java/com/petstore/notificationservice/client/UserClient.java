package com.petstore.notificationservice.client;

import java.util.UUID;

public interface UserClient {
    UserInfo getUser(UUID userId);

    record UserInfo(UUID id, String email, String name) {}
}

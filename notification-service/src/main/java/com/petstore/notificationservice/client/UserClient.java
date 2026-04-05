package com.petstore.notificationservice.client;

import java.util.UUID;

public interface UserClient {
    UserInfo getUser(UUID userId);
}

package com.petstore.notificationservice.domain.service;

import java.util.UUID;

public interface NotificationService {
    void sendPaymentSuccessNoti(UUID userId);
}

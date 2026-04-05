package com.petstore.notificationservice.service;

import java.util.UUID;

public interface NotificationService {
    void sendPaymentSuccessNoti(UUID userId);
}

package com.petstore.notificationservice.domain.service.impl;

import java.util.UUID;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.petstore.notificationservice.api.dto.SendMailRequest;
import com.petstore.notificationservice.domain.service.NotificationService;
import com.petstore.notificationservice.infra.client.UserClient;
import com.petstore.notificationservice.infra.client.UserClient.UserInfo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final JavaMailSender mailSender;
    private final UserClient userClient;

    @Override
    public void sendPaymentSuccessNoti(UUID userId) {
        UserInfo user = userClient.getUser(userId);

        if (user == null || user.email() == null) {
            throw new RuntimeException("User email not found");
        }

        SendMailRequest request = SendMailRequest.builder()
                .email(user.email())
                .subject("Payment Confirmation")
                .text("Your payment has been successfully processed!")
                .build();

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@petstore.com");
        message.setTo(request.getEmail());
        message.setSubject(request.getSubject());
        message.setText(request.getText());
        mailSender.send(message);
    }
}

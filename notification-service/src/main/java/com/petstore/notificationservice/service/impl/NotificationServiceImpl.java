package com.petstore.notificationservice.service.impl;

import com.petstore.notificationservice.client.UserClient;
import com.petstore.notificationservice.client.UserInfo;
import com.petstore.notificationservice.dto.request.SendMailRequest;
import com.petstore.notificationservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.UUID;

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

        SendMailRequest request = new SendMailRequest(
                user.email(),
                "Payment Confirmation",
                "Your payment has been successfully processed!");

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@petstore.com");
        message.setTo(request.getEmail());
        message.setSubject(request.getSubject());
        message.setText(request.getText());
        mailSender.send(message);
    }
}

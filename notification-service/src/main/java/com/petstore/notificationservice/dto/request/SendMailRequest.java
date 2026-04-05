package com.petstore.notificationservice.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SendMailRequest {
    String email;
    String subject;
    String text;
}

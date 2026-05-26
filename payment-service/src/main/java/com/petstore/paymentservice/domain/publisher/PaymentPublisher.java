package com.petstore.paymentservice.domain.publisher;

import com.petstore.paymentservice.domain.model.Payment;

public interface PaymentPublisher {
    void publishPaymentSucceeded(Payment payment);
    void publishPaymentFailed(Payment payment, String reason);
    void publishPaymentCanceled(Payment payment);
}


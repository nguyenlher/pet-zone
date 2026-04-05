package com.petstore.paymentservice.publisher;

import com.petstore.paymentservice.model.Payment;

public interface PaymentPublisher {
    void publishPaymentSucceeded(Payment payment);
    void publishPaymentFailed(Payment payment, String reason);
}

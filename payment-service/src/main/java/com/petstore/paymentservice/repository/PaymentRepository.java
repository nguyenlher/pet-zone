package com.petstore.paymentservice.repository;

import com.petstore.paymentservice.model.Payment;
import java.util.Optional;
import java.util.UUID;

public interface PaymentRepository {
    Payment save(Payment payment);

    Optional<Payment> findByOrderId(UUID orderId);

    Optional<Payment> findByTransactionId(String transactionId);
}

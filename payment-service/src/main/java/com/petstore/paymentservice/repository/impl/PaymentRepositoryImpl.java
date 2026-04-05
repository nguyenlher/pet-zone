package com.petstore.paymentservice.repository.impl;

import com.petstore.paymentservice.entity.PaymentEntity;
import com.petstore.paymentservice.mapper.PaymentMapper;
import com.petstore.paymentservice.model.Payment;
import com.petstore.paymentservice.repository.PaymentRepository;
import com.petstore.paymentservice.repository.jpa.JpaPaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class PaymentRepositoryImpl implements PaymentRepository {

    private final JpaPaymentRepository jpaPaymentRepository;
    private final PaymentMapper paymentMapper;

    @Override
    public Payment save(Payment payment) {
        PaymentEntity entity = paymentMapper.toEntity(payment);
        PaymentEntity saved = jpaPaymentRepository.save(entity);
        return paymentMapper.toDomain(saved);
    }

    @Override
    public Optional<Payment> findByOrderId(UUID orderId) {
        return jpaPaymentRepository.findByOrderId(orderId).map(paymentMapper::toDomain);
    }

    @Override
    public Optional<Payment> findByTransactionId(String transactionId) {
        return jpaPaymentRepository.findByTransactionId(transactionId).map(paymentMapper::toDomain);
    }
}

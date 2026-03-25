package com.petstore.paymentservice.entity;

import com.petstore.paymentservice.model.enums.PaymentMethod;
import com.petstore.paymentservice.model.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payments")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class PaymentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(name = "order_id")
    UUID orderId;

    @Column(name = "user_id")
    UUID userId;

    @Column(name = "transaction_id")
    String transactionId;

    @Column(name = "amount")
    double amount;

    @Column(name = "method")
    PaymentMethod method;

    @Column(name = "status")
    PaymentStatus status;

    @Column(name = "created_at")
    LocalDateTime createdAt;

    @Column(name = "updated_At")
    LocalDateTime updatedAt;
}

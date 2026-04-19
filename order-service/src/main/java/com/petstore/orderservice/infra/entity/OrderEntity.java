package com.petstore.orderservice.infra.entity;

import com.petstore.orderservice.domain.model.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "orders")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class OrderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(name = "user_id")
    UUID userId;

    @Column(name = "pet_id")
    UUID petId;

    @Column(name = "discount_amount")
    double discountAmount;

    @Column(name = "shipping_fee")
    double shippingFee;

    @Column(name = "address")
    String address;

    @Column(name = "status")
    OrderStatus status;

    @Column(name = "created_at")
    LocalDateTime createdAt;

    @Column(name = "updated_at")
    LocalDateTime updatedAt;
}

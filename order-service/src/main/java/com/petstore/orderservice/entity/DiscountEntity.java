package com.petstore.orderservice.entity;

import com.petstore.orderservice.model.enums.DiscountType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "discounts")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class DiscountEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(name = "code")
    String code;

    @Column(name = "description")
    String description;

    @Column(name = "type")
    @Enumerated
    DiscountType type;

    @Column(name = "max_discount_amount")
    double maxDiscountAmount;

    @Column(name = "min_order_amount")
    double minOrderAmount;

    @Column(name = "usage_limit")
    int usageLimit;

    @Column(name = "expired")
    LocalDateTime expired;
}

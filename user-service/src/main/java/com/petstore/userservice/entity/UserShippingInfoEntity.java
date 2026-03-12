package com.petstore.userservice.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_shipping_info")
@Data
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class UserShippingInfoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(name = "user_id")
    UUID userId;
    
    @Column(name = "phone_number")
    String phoneNumber;

    @Column(name = "address_line")
    String addressLine;

    @Column(name = "district")
    String district;

    @Column(name = "city")
    String city;

    @Column(name = "is_default")
    boolean isDefault;

    @Column(name = "created_at")
    LocalDateTime createdAt;

    @Column(name = "updated_at")
    LocalDateTime updatedAt;
}

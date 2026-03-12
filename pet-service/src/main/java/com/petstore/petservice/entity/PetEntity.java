package com.petstore.petservice.entity;

import com.petstore.petservice.model.enums.PetStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class PetEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(name = "name")
    String name;

    @Column(name = "breed")
    String breed;

    @Column(name = "age")
    int age;

    @Column(name = "color")
    String color;

    @Column(name = "gender")
    String gender;

    @Column(name = "health_status")
    String healthStatus;

    @Column(name = "price")
    double price;

    @Column(name = "description")
    String description;

    @Column(name = "stock")
    int stock;

    @Column(name = "status")
    PetStatus status;

    @Column(name = "views")
    int views;

    @Column(name = "created_at")
    LocalDateTime createdAt;

    @Column(name = "updated_at")
    LocalDateTime updatedAt;
}

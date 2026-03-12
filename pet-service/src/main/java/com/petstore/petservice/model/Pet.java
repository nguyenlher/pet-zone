package com.petstore.petservice.model;

import com.petstore.petservice.model.enums.PetStatus;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class Pet {
    UUID id;
    String name;
    String breed;
    int age;
    String color;
    String gender;
    String healthStatus;
    double price;
    String description;
    int stock;
    PetStatus status;
    int views;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}

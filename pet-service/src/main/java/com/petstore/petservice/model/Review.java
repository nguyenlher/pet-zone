package com.petstore.petservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class Review {
    UUID id;
    UUID breedId;
    UUID userId;
    Integer rating; // 1-5 sao
    String comment;
    
    // Đánh giá chi tiết
    Integer ratingFriendly; // Thân thiện
    Integer ratingHealth; // Sức khỏe tốt
    Integer ratingTrain; // Dễ huấn luyện
    Integer ratingKids; // Tốt với trẻ em
    
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
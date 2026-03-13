package com.petstore.petservice.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "pets", indexes = {
        @Index(name = "idx_pet_type", columnList = "pet_type"),
        @Index(name = "idx_pet_status", columnList = "status"),
        @Index(name = "idx_pet_breed", columnList = "breed_primary_id"),
        @Index(name = "idx_pet_name", columnList = "name")
})
@Data
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class PetEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    // === BASIC INFO ===
    @Column(nullable = false)
    String name; // "Bông", "Milo", "Luna", "Max"

    @Column(name = "pet_type", nullable = false)
    String petType; // "dog", "cat"

    @Column(name = "breed_primary_id")
    UUID breedPrimaryId; // ID của giống chính (tham chiếu bảng breeds)

    @Column(name = "breed_secondary_id")
    UUID breedSecondaryId; // ID giống phụ, null nếu thuần chủng, có giá trị nếu là giống lai

    @Column(nullable = false)
    String gender; // "male", "female"

    @Column(name = "birth_date")
    LocalDate birthDate; // "2023-05-15", "2024-01-20"

    @Column(name = "birth_date_accuracy")
    String birthDateAccuracy; // "exact", "estimated_month", "estimated_year"

    // === PHYSICAL ATTRIBUTES ===
    Double weight; // kg: 2.5, 5.0, 15.5, 30.0

    Double height; // cm: 25, 40, 60, 80

    Double length; // cm: 30, 50, 80, 120

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    String[] colors; // ["vàng"], ["đen", "trắng"], ["xám", "trắng"], ["nâu", "vàng"]

    @Column(name = "color_pattern")
    String colorPattern; // "solid", "spotted", "striped", "brindle", "merle", "bicolor", "tricolor"

    @Column(name = "fur_type")
    String furType; // "short", "medium", "long", "hairless", "curly", "wire"

    // === FACE FEATURES (AI 3D) ===
    @Column(name = "face_shape")
    String faceShape; // "round", "triangular", "square", "oblong"

    @Column(name = "eye_color")
    String eyeColor; // "brown", "blue", "green", "hazel", "amber", "heterochromia"

    @Column(name = "eye_shape")
    String eyeShape; // "round", "almond", "droopy"

    @Column(name = "ear_type")
    String earType; // "erect", "floppy", "semi-erect", "rose", "button", "folded"

    @Column(name = "muzzle_length")
    String muzzleLength; // "short", "medium", "long"

    // === BODY FEATURES ===
    @Column(name = "body_shape")
    String bodyShape; // "slim", "muscular", "stocky", "cobby", "long"

    @Column(name = "leg_length")
    String legLength; // "short", "medium", "long"

    @Column(name = "tail_type")
    String tailType; // "long", "docked", "curled", "bobbed", "tailless"

    // === DISTINCTIVE FEATURES ===
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    String[] distinctiveFeatures; // ["đốm trắng trên ngực"], ["sẹo trên chân trái"], ["mắt xanh"], ["đuôi cụp"]

    // === HEALTH ===
    @Column(name = "health_status")
    String healthStatus; // "excellent", "good", "fair", "needs_care"

    @Column(name = "spayed_neutered")
    Boolean spayedNeutered = false; // true, false

    @Column(name = "vaccinated")
    Boolean vaccinated = false; // true, false

    @Column(name = "dewormed")
    Boolean dewormed = false; // true, false

    @Column(name = "last_checkup_date")
    LocalDate lastCheckupDate; // "2024-10-15", "2025-01-20"

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    String[] allergies; // ["thức ăn", "bụi", "phấn hoa"], null nếu không có

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    String[] chronicConditions; // ["tiểu đường", "viêm khớp"], null nếu không có

    // === BEHAVIOR ===
    @Column(name = "energy_level")
    Integer energyLevel; // 1-5 (1: rất thấp, 5: rất cao)

    @Column(name = "sociability")
    Integer sociability; // 1-5 (1: rất nhút nhát, 5: rất thân thiện)

    @Column(name = "child_friendly")
    Integer childFriendly; // 1-5 (1: không thích trẻ em, 5: rất thân thiện với trẻ)

    @Column(name = "pet_friendly")
    Integer petFriendly; // 1-5 (1: không thích thú khác, 5: hòa đồng với mọi thú)

    @Column(name = "trainability")
    Integer trainability; // 1-5 (1: khó huấn luyện, 5: dễ huấn luyện)

    @Column(name = "barking_tendency")
    Integer barkingTendency; // 1-5 (1: ít sủa, 5: sủa nhiều)

    @Column(name = "separation_anxiety")
    Integer separationAnxiety; // 1-5 (1: không lo âu, 5: lo âu nặng khi ở một mình)

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    String[] commands; // ["sit", "stay", "come", "lie down"], null nếu chưa biết

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    String[] favoriteActivities; // ["chạy", "bơi", "ném bóng", "bắt chuột"]

    // === AI 3D MODEL ===
    @Column(name = "model_3d_url_glb")
    String model3dUrlGlb; // URL file GLB (cho web Three.js)

    @Column(name = "model_3d_url_obj")
    String model3dUrlObj; // URL file OBJ

    @Column(name = "model_texture_url")
    String modelTextureUrl; // URL file texture

    @Column(name = "model_thumbnail_url")
    String modelThumbnailUrl; // Ảnh thumbnail từ model 3D

    @Column(name = "model_source_image_url")
    String modelSourceImageUrl; // Ảnh gốc dùng để tạo 3D

    @Column(name = "model_ai_generated")
    Boolean modelAiGenerated = false; // true nếu model được tạo bằng AI

    @Column(name = "model_confidence_score")
    Double modelConfidenceScore; // 0.0 - 1.0, độ tin cậy của AI

    @Column(name = "model_generated_at")
    LocalDateTime modelGeneratedAt; // Thời gian tạo model

    // === AI GENERATED CONTENT ===
    @Column(name = "ai_description", length = 2000)
    String aiDescription; // Mô tả do AI sinh: "Bé Milo là chó Phốc 2 tháng tuổi, năng động, thân thiện..."

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    String[] aiTags; // ["dễ thương", "năng động", "phù hợp gia đình", "mới về"]

    @Column(name = "ai_price_suggestion")
    Double aiPriceSuggestion; // Giá gợi ý từ AI: 5000000, 12000000

    // === PRICE ===
    @Column(nullable = false)
    Double price; // Giá bán: 5000000, 15000000, 25000000

    @Column(name = "original_price")
    Double originalPrice; // Giá gốc (nếu đang giảm giá): 6000000, 18000000

    @Column(name = "negotiable")
    Boolean negotiable = false; // true: có thể thương lượng, false: giá cố định

    @Column(name = "available_from")
    LocalDate availableFrom; // Ngày bắt đầu có thể mua: 2025-03-01

    @Column(name = "available_to")
    LocalDate availableTo; // Ngày kết thúc: 2025-06-01, null nếu không giới hạn

    // === LOCATION ===
    String city; // "Hà Nội", "Hồ Chí Minh", "Đà Nẵng"

    String district; // "Cầu Giấy", "Quận 1", "Hải Châu"

    @Column(name = "address_detail")
    String addressDetail; // "Số 123 Đường ABC, Phường XYZ"

    Double latitude; // 21.0285 (tọa độ cho map)

    Double longitude; // 105.8542

    // === STATUS ===
    @Column(nullable = false)
    String status; // "available", "sold", "reserved", "withdrawn", "draft"

    @Column(name = "is_featured")
    Boolean isFeatured = false; // true: thú cưng nổi bật (hiện ở trang chủ)

    @Column(name = "featured_until")
    LocalDate featuredUntil; // Ngày hết hạn nổi bật: 2025-04-01

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    String[] promotionBadges; // ["new", "hot", "discount", "rare"]

    // === METRICS ===
    @Column(name = "view_count")
    Integer viewCount = 0; // Số lượt xem

    @Column(name = "favorite_count")
    Integer favoriteCount = 0; // Số lượt yêu thích

    @Column(name = "inquiry_count")
    Integer inquiryCount = 0; // Số lượt hỏi

    // === AUDIT ===
    @Column(name = "created_at")
    LocalDateTime createdAt; // Thời gian tạo

    @Column(name = "updated_at")
    LocalDateTime updatedAt; // Thời gian cập nhật

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (viewCount == null) viewCount = 0;
        if (favoriteCount == null) favoriteCount = 0;
        if (inquiryCount == null) inquiryCount = 0;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
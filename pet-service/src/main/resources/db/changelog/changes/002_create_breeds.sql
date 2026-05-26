-- ============================================
-- CREATE BREEDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS breeds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    pet_type_id UUID NOT NULL,
    description TEXT,
    avg_rating DECIMAL(3,2),
    total_reviews INTEGER DEFAULT 0,
    image_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_breeds_pet_type FOREIGN KEY (pet_type_id) REFERENCES pet_types(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_breeds_pet_type_id ON breeds(pet_type_id);
CREATE INDEX idx_breeds_is_active ON breeds(is_active);
CREATE INDEX idx_breeds_name ON breeds(name);

-- Insert sample breeds for dogs
INSERT INTO breeds (name, pet_type_id, description, is_active, created_at, updated_at)
SELECT 
    breed_name,
    pt.id,
    breed_desc,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM pet_types pt
CROSS JOIN (
    VALUES 
        ('Golden Retriever', 'Giống chó thân thiện, thông minh và dễ huấn luyện'),
        ('Labrador', 'Giống chó năng động, trung thành và tốt bụng'),
        ('Poodle', 'Giống chó thông minh, không rụng lông'),
        ('Husky', 'Giống chó đẹp, năng động và thích hoạt động ngoài trời'),
        ('Corgi', 'Giống chó nhỏ, đáng yêu với đôi chân ngắn'),
        ('Shiba Inu', 'Giống chó Nhật Bản, độc lập và trung thành'),
        ('Samoyed', 'Giống chó lông trắng như tuyết, luôn cười, thân thiện'),
        ('Chihuahua', 'Giống chó nhỏ nhất thế giới, dũng cảm và trung thành'),
        ('Dachshund', 'Giống chó thân dài chân ngắn, thông minh và vui vẻ'),
        ('Pomeranian', 'Giống chó nhỏ lông dài, năng động và đáng yêu'),
        ('Pug', 'Giống chó mặt nhăn, tính cách vui vẻ và thân thiện')
) AS breeds_data(breed_name, breed_desc)
WHERE pt.name = 'Chó';

-- Insert sample breeds for cats
INSERT INTO breeds (name, pet_type_id, description, is_active, created_at, updated_at)
SELECT 
    breed_name,
    pt.id,
    breed_desc,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM pet_types pt
CROSS JOIN (
    VALUES 
        ('Ba Tư', 'Giống mèo lông dài, hiền lành và sang trọng'),
        ('Anh Lông Ngắn', 'Giống mèo đáng yêu, tròn trịa và dễ nuôi'),
        ('Xiêm', 'Giống mèo thông minh, năng động và hay nói'),
        ('Maine Coon', 'Giống mèo lớn, thân thiện và dễ gần'),
        ('Munchkin', 'Giống mèo chân ngắn, đáng yêu và hiếu động'),
        ('Ragdoll', 'Giống mèo hiền lành, thích được ôm ấp'),
        ('Bengal', 'Giống mèo vằn như hổ, năng động và thông minh'),
        ('Russian Blue', 'Giống mèo lông xám xanh, nhút nhát nhưng trung thành'),
        ('Scottish Fold', 'Giống mèo tai cụp, hiền lành và đáng yêu')
) AS breeds_data(breed_name, breed_desc)
WHERE pt.name = 'Mèo';

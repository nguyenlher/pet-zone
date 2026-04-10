-- ============================================
-- CREATE PETS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS pets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type_id UUID NOT NULL,
    breed_id UUID,
    name VARCHAR(100) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    birth_date DATE,
    weight DECIMAL(10,2),
    colors TEXT[],
    fur_type VARCHAR(20),
    health_status VARCHAR(20) NOT NULL,
    vaccinated BOOLEAN NOT NULL DEFAULT FALSE,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL,
    view_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_pets_type FOREIGN KEY (type_id) REFERENCES pet_types(id) ON DELETE RESTRICT,
    CONSTRAINT fk_pets_breed FOREIGN KEY (breed_id) REFERENCES breeds(id) ON DELETE SET NULL,
    CONSTRAINT chk_pets_gender CHECK (gender IN ('MALE', 'FEMALE')),
    CONSTRAINT chk_pets_fur_type CHECK (fur_type IN ('LONG', 'SHORT', 'CURLY', 'HAIRLESS')),
    CONSTRAINT chk_pets_health_status CHECK (health_status IN ('EXCELLENT', 'GOOD', 'FAIR', 'NEEDS_CARE')),
    CONSTRAINT chk_pets_status CHECK (status IN ('AVAILABLE', 'SOLD', 'RESERVED'))
);

-- Indexes
CREATE INDEX idx_pets_type_id ON pets(type_id);
CREATE INDEX idx_pets_breed_id ON pets(breed_id);
CREATE INDEX idx_pets_status ON pets(status);
CREATE INDEX idx_pets_price ON pets(price);
CREATE INDEX idx_pets_created_at ON pets(created_at DESC);
CREATE INDEX idx_pets_view_count ON pets(view_count DESC);

-- Full-text search index for name and description
CREATE INDEX idx_pets_name_trgm ON pets USING gin(name gin_trgm_ops);
CREATE INDEX idx_pets_description_trgm ON pets USING gin(description gin_trgm_ops);

-- Enable pg_trgm extension for fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm;


-- ============================================
-- INSERT SAMPLE DATA FOR DOGS
-- ============================================
INSERT INTO pets (name, type_id, breed_id, gender, birth_date, weight, colors, fur_type, health_status, vaccinated, price, description, status, view_count, created_at, updated_at)
SELECT 
    pet_name,
    pt.id,
    b.id,
    pet_gender,
    pet_birth_date,
    pet_weight,
    pet_colors,
    pet_fur_type,
    pet_health_status,
    pet_vaccinated,
    pet_price,
    pet_description,
    pet_status,
    0,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM pet_types pt
CROSS JOIN (
    VALUES 
        ('Max', 'Golden Retriever', 'MALE', '2022-03-15'::DATE, 28.50, ARRAY['Vàng', 'Kem'], 'LONG', 'EXCELLENT', true, 15000000.00, 'Chó Golden Retriever đực 2 tuổi, rất thân thiện và năng động. Đã tiêm phòng đầy đủ, có giấy tờ chứng nhận. Thích chơi đùa và rất ngoan ngoãn.', 'AVAILABLE'),
        ('Bella', 'Labrador', 'FEMALE', '2021-08-20'::DATE, 25.00, ARRAY['Nâu', 'Chocolate'], 'SHORT', 'EXCELLENT', true, 12000000.00, 'Chó Labrador cái 3 tuổi, trung thành và thông minh. Đã được huấn luyện cơ bản, rất thích trẻ em. Sức khỏe tốt, đã tiêm phòng đầy đủ.', 'AVAILABLE'),
        ('Charlie', 'Poodle', 'MALE', '2023-01-10'::DATE, 8.50, ARRAY['Trắng'], 'CURLY', 'GOOD', true, 18000000.00, 'Chó Poodle đực 1 tuổi, lông xoăn đẹp, không rụng lông. Thích hợp cho người bị dị ứng. Đã cắt tỉa lông chuyên nghiệp, rất đáng yêu.', 'AVAILABLE'),
        ('Luna', 'Husky', 'FEMALE', '2022-11-05'::DATE, 22.00, ARRAY['Xám', 'Trắng'], 'LONG', 'EXCELLENT', true, 20000000.00, 'Chó Husky cái 1.5 tuổi, mắt xanh đẹp, lông dày. Rất năng động, thích hoạt động ngoài trời. Đã huấn luyện đi dây xích, nghe lời tốt.', 'AVAILABLE'),
        ('Rocky', 'Corgi', 'MALE', '2023-05-20'::DATE, 12.00, ARRAY['Nâu', 'Trắng'], 'SHORT', 'EXCELLENT', true, 25000000.00, 'Chó Corgi đực 8 tháng tuổi, chân ngắn đáng yêu. Tính cách vui vẻ, thân thiện với mọi người. Đã tiêm phòng đầy đủ, có giấy chứng nhận xuất xứ.', 'AVAILABLE')
) AS dogs_data(pet_name, breed_name, pet_gender, pet_birth_date, pet_weight, pet_colors, pet_fur_type, pet_health_status, pet_vaccinated, pet_price, pet_description, pet_status)
LEFT JOIN breeds b ON b.name = dogs_data.breed_name AND b.pet_type_id = pt.id
WHERE pt.name = 'Chó';

-- ============================================
-- INSERT SAMPLE DATA FOR CATS
-- ============================================
INSERT INTO pets (name, type_id, breed_id, gender, birth_date, weight, colors, fur_type, health_status, vaccinated, price, description, status, view_count, created_at, updated_at)
SELECT 
    pet_name,
    pt.id,
    b.id,
    pet_gender,
    pet_birth_date,
    pet_weight,
    pet_colors,
    pet_fur_type,
    pet_health_status,
    pet_vaccinated,
    pet_price,
    pet_description,
    pet_status,
    0,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM pet_types pt
CROSS JOIN (
    VALUES 
        ('Mimi', 'Mèo Ba Tư', 'FEMALE', '2022-06-10'::DATE, 4.50, ARRAY['Trắng'], 'LONG', 'EXCELLENT', true, 8000000.00, 'Mèo Ba Tư cái 1.5 tuổi, lông dài mượt mà, mặt tròn đáng yêu. Tính cách hiền lành, thích được vuốt ve. Đã tiêm phòng và tẩy giun đầy đủ.', 'AVAILABLE'),
        ('Simba', 'Mèo Anh Lông Ngắn', 'MALE', '2023-02-14'::DATE, 5.20, ARRAY['Xám', 'Xanh'], 'SHORT', 'EXCELLENT', true, 10000000.00, 'Mèo Anh lông ngắn đực 10 tháng, màu xám xanh đẹp. Tròn trịa, đáng yêu, tính cách dễ gần. Đã huấn luyện đi vệ sinh, rất sạch sẽ.', 'AVAILABLE'),
        ('Nala', 'Mèo Xiêm', 'FEMALE', '2021-12-20'::DATE, 3.80, ARRAY['Kem', 'Nâu'], 'SHORT', 'GOOD', true, 6000000.00, 'Mèo Xiêm cái 2 tuổi, mắt xanh đẹp, thân hình thon gọn. Rất năng động và thông minh, thích giao tiếp với người. Đã tiêm phòng đầy đủ.', 'AVAILABLE'),
        ('Leo', 'Mèo Maine Coon', 'MALE', '2022-09-05'::DATE, 7.50, ARRAY['Nâu', 'Đen', 'Trắng'], 'LONG', 'EXCELLENT', true, 15000000.00, 'Mèo Maine Coon đực 1.5 tuổi, giống mèo lớn nhất thế giới. Tính cách thân thiện, dễ gần, thích chơi với trẻ em. Lông dài đẹp, sức khỏe tốt.', 'AVAILABLE'),
        ('Mochi', 'Mèo Munchkin', 'FEMALE', '2023-04-15'::DATE, 3.20, ARRAY['Cam', 'Trắng'], 'SHORT', 'EXCELLENT', true, 12000000.00, 'Mèo Munchkin cái 8 tháng, chân ngắn đáng yêu. Tính cách vui vẻ, hiếu động, thích khám phá. Đã tiêm phòng đầy đủ, có giấy chứng nhận.', 'AVAILABLE')
) AS cats_data(pet_name, breed_name, pet_gender, pet_birth_date, pet_weight, pet_colors, pet_fur_type, pet_health_status, pet_vaccinated, pet_price, pet_description, pet_status)
LEFT JOIN breeds b ON b.name = cats_data.breed_name AND b.pet_type_id = pt.id
WHERE pt.name = 'Mèo';

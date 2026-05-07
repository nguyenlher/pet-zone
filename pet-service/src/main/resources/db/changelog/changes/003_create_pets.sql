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

-- Enable pg_trgm extension for fuzzy search (must be before using gin_trgm_ops)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

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
        ('Hachi', 'Shiba Inu', 'MALE', '2022-01-15'::DATE, 10.50, ARRAY['Đỏ', 'Trắng'], 'SHORT', 'EXCELLENT', true, 18000000.00, 'Chó Shiba Inu đực 2 tuổi, giống chó Nhật Bản nổi tiếng. Tính cách độc lập, thông minh và trung thành. Lông đỏ đẹp, sức khỏe tốt.', 'AVAILABLE'),
        ('Rocky', 'Corgi', 'MALE', '2023-05-20'::DATE, 12.00, ARRAY['Nâu', 'Trắng'], 'SHORT', 'EXCELLENT', true, 25000000.00, 'Chó Corgi đực 8 tháng tuổi, chân ngắn đáng yêu. Tính cách vui vẻ, thân thiện với mọi người. Đã tiêm phòng đầy đủ, có giấy chứng nhận xuất xứ.', 'AVAILABLE'),
        ('Max', 'Golden Retriever', 'MALE', '2022-03-15'::DATE, 28.50, ARRAY['Vàng', 'Kem'], 'LONG', 'EXCELLENT', true, 15000000.00, 'Chó Golden Retriever đực 2 tuổi, rất thân thiện và năng động. Đã tiêm phòng đầy đủ, có giấy tờ chứng nhận. Thích chơi đùa và rất ngoan ngoãn.', 'AVAILABLE'),
        ('Snow', 'Samoyed', 'MALE', '2022-12-05'::DATE, 24.00, ARRAY['Trắng'], 'LONG', 'EXCELLENT', true, 30000000.00, 'Chó Samoyed đực 1.5 tuổi, lông trắng như tuyết, luôn cười. Tính cách vui vẻ, thân thiện. Cần chải lông thường xuyên.', 'AVAILABLE'),
        ('Tiny', 'Chihuahua', 'MALE', '2023-06-10'::DATE, 2.50, ARRAY['Nâu', 'Trắng'], 'SHORT', 'GOOD', true, 8000000.00, 'Chó Chihuahua đực 7 tháng, nhỏ nhắn xinh xắn. Tính cách dũng cảm, thích được ôm. Thích hợp nuôi trong căn hộ.', 'AVAILABLE'),
        ('Oscar', 'Dachshund', 'MALE', '2022-04-15'::DATE, 8.00, ARRAY['Nâu', 'Đen'], 'SHORT', 'EXCELLENT', true, 12000000.00, 'Chó Dachshund đực 1.5 tuổi, thân dài chân ngắn đặc trưng. Tính cách vui vẻ, thông minh. Thích đào bới.', 'AVAILABLE'),
        ('Luna', 'Husky', 'FEMALE', '2022-11-05'::DATE, 22.00, ARRAY['Xám', 'Trắng'], 'LONG', 'EXCELLENT', true, 20000000.00, 'Chó Husky cái 1.5 tuổi, mắt xanh đẹp, lông dày. Rất năng động, thích hoạt động ngoài trời. Đã huấn luyện đi dây xích, nghe lời tốt.', 'AVAILABLE'),
        ('Buddy', 'Labrador', 'MALE', '2022-05-10'::DATE, 30.00, ARRAY['Vàng'], 'SHORT', 'EXCELLENT', true, 13000000.00, 'Chó Labrador đực 1.5 tuổi, rất thân thiện và trung thành. Thích bơi lội và chơi đùa. Đã huấn luyện cơ bản.', 'AVAILABLE'),
        ('Fluffy', 'Pomeranian', 'MALE', '2023-04-05'::DATE, 3.50, ARRAY['Cam', 'Trắng'], 'LONG', 'EXCELLENT', true, 15000000.00, 'Chó Pomeranian đực 9 tháng, lông dài mềm mại. Rất đáng yêu và năng động. Thích được chải lông và vuốt ve.', 'AVAILABLE'),
        ('Charlie', 'Poodle', 'MALE', '2023-01-10'::DATE, 8.50, ARRAY['Trắng'], 'CURLY', 'GOOD', true, 18000000.00, 'Chó Poodle đực 1 tuổi, lông xoăn đẹp, không rụng lông. Thích hợp cho người bị dị ứng. Đã cắt tỉa lông chuyên nghiệp, rất đáng yêu.', 'AVAILABLE'),
        ('Puggy', 'Pug', 'MALE', '2022-12-20'::DATE, 8.00, ARRAY['Vàng', 'Đen'], 'SHORT', 'GOOD', true, 10000000.00, 'Chó Pug đực 1.5 tuổi, mặt nhăn đáng yêu. Tính cách vui vẻ, thích ngủ. Cần chú ý về hô hấp.', 'AVAILABLE')
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
        ('Simba', 'Mèo Anh Lông Ngắn', 'MALE', '2023-02-14'::DATE, 5.20, ARRAY['Xám', 'Xanh'], 'SHORT', 'EXCELLENT', true, 10000000.00, 'Mèo Anh lông ngắn đực 10 tháng, màu xám xanh đẹp. Tròn trịa, đáng yêu, tính cách dễ gần. Đã huấn luyện đi vệ sinh, rất sạch sẽ.', 'AVAILABLE'),
        ('Mochi', 'Mèo Munchkin', 'FEMALE', '2023-04-15'::DATE, 3.20, ARRAY['Cam', 'Trắng'], 'SHORT', 'EXCELLENT', true, 12000000.00, 'Mèo Munchkin cái 8 tháng, chân ngắn đáng yêu. Tính cách vui vẻ, hiếu động, thích khám phá. Đã tiêm phòng đầy đủ, có giấy chứng nhận.', 'AVAILABLE'),
        ('Angel', 'Ragdoll', 'FEMALE', '2022-06-15'::DATE, 5.50, ARRAY['Trắng', 'Xám'], 'LONG', 'EXCELLENT', true, 15000000.00, 'Mèo Ragdoll cái 1.5 tuổi, lông dài mềm mại. Tính cách hiền lành như búp bê. Rất thích được ôm và vuốt ve.', 'AVAILABLE'),
        ('Nala', 'Mèo Xiêm', 'FEMALE', '2021-12-20'::DATE, 3.80, ARRAY['Kem', 'Nâu'], 'SHORT', 'GOOD', true, 6000000.00, 'Mèo Xiêm cái 2 tuổi, mắt xanh đẹp, thân hình thon gọn. Rất năng động và thông minh, thích giao tiếp với người. Đã tiêm phòng đầy đủ.', 'AVAILABLE'),
        ('Tiger', 'Bengal', 'MALE', '2022-10-05'::DATE, 5.50, ARRAY['Nâu', 'Đen', 'Vàng'], 'SHORT', 'EXCELLENT', true, 18000000.00, 'Mèo Bengal đực 1.5 tuổi, vằn như hổ. Rất năng động và thông minh. Thích chơi đùa và leo trèo.', 'AVAILABLE'),
        ('Leo', 'Mèo Maine Coon', 'MALE', '2022-09-05'::DATE, 7.50, ARRAY['Nâu', 'Đen', 'Trắng'], 'LONG', 'EXCELLENT', true, 15000000.00, 'Mèo Maine Coon đực 1.5 tuổi, giống mèo lớn nhất thế giới. Tính cách thân thiện, dễ gần, thích chơi với trẻ em. Lông dài đẹp, sức khỏe tốt.', 'AVAILABLE'),
        ('Blue', 'Russian Blue', 'MALE', '2023-02-10'::DATE, 4.50, ARRAY['Xám', 'Xanh'], 'SHORT', 'EXCELLENT', true, 13000000.00, 'Mèo Russian Blue đực 10 tháng, lông xám xanh đẹp. Tính cách nhút nhát nhưng trung thành. Rất sạch sẽ.', 'AVAILABLE'),
        ('Foldy', 'Scottish Fold', 'MALE', '2022-12-05'::DATE, 5.00, ARRAY['Cam', 'Trắng'], 'SHORT', 'GOOD', true, 16000000.00, 'Mèo Scottish Fold đực 1.5 tuổi, tai cụp đặc trưng. Tính cách hiền lành, thích ngồi yên. Rất đáng yêu.', 'AVAILABLE')
) AS cats_data(pet_name, breed_name, pet_gender, pet_birth_date, pet_weight, pet_colors, pet_fur_type, pet_health_status, pet_vaccinated, pet_price, pet_description, pet_status)
LEFT JOIN breeds b ON b.name = cats_data.breed_name AND b.pet_type_id = pt.id
WHERE pt.name = 'Mèo';

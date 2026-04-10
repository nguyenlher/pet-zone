-- ============================================
-- CREATE PET_IMAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS pet_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id UUID NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    is_thumbnail BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_pet_images_pet FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_pet_images_pet_id ON pet_images(pet_id);
CREATE INDEX idx_pet_images_sort_order ON pet_images(pet_id, sort_order);
CREATE INDEX idx_pet_images_thumbnail ON pet_images(pet_id, is_thumbnail) WHERE is_thumbnail = TRUE;

-- Ensure only one thumbnail per pet
CREATE UNIQUE INDEX idx_pet_images_one_thumbnail ON pet_images(pet_id) WHERE is_thumbnail = TRUE;


-- ============================================
-- INSERT SAMPLE PET IMAGES FOR DOGS
-- ============================================
-- Max (Golden Retriever)
INSERT INTO pet_images (pet_id, image_url, is_thumbnail, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24', true, 1
FROM pets p WHERE p.name = 'Max' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Chó');

INSERT INTO pet_images (pet_id, image_url, is_thumbnail, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1552053831-71594a27632d', false, 2
FROM pets p WHERE p.name = 'Max' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Chó');

INSERT INTO pet_images (pet_id, image_url, is_thumbnail, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1558788353-f76d92427f16', false, 3
FROM pets p WHERE p.name = 'Max' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Chó');

-- Bella (Labrador)
INSERT INTO pet_images (pet_id, image_url, is_thumbnail, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1587300003388-59208cc962cb', true, 1
FROM pets p WHERE p.name = 'Bella' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Chó');

INSERT INTO pet_images (pet_id, image_url, is_thumbnail, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1560807707-8cc77767d783', false, 2
FROM pets p WHERE p.name = 'Bella' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Chó');

-- Charlie (Poodle)
INSERT INTO pet_images (pet_id, image_url, is_thumbnail, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1616080484084-8dc3b6c0d9e4', true, 1
FROM pets p WHERE p.name = 'Charlie' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Chó');

INSERT INTO pet_images (pet_id, image_url, is_thumbnail, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a', false, 2
FROM pets p WHERE p.name = 'Charlie' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Chó');

INSERT INTO pet_images (pet_id, image_url, is_thumbnail, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8', false, 3
FROM pets p WHERE p.name = 'Charlie' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Chó');

-- Luna (Husky)
INSERT INTO pet_images (pet_id, image_url, is_thumbnail, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1568572933382-74d440642117', true, 1
FROM pets p WHERE p.name = 'Luna' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Chó');

INSERT INTO pet_images (pet_id, image_url, is_thumbnail, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea', false, 2
FROM pets p WHERE p.name = 'Luna' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Chó');

-- Rocky (Corgi)
INSERT INTO pet_images (pet_id, image_url, is_thumbnail, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1612536616423-e0b51f4e019e', true, 1
FROM pets p WHERE p.name = 'Rocky' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Chó');

INSERT INTO pet_images (pet_id, image_url, is_thumbnail, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e', false, 2
FROM pets p WHERE p.name = 'Rocky' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Chó');

INSERT INTO pet_images (pet_id, image_url, is_thumbnail, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1558929996-da64ba858215', false, 3
FROM pets p WHERE p.name = 'Rocky' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Chó');


-- ============================================
-- INSERT SAMPLE PET IMAGES FOR CATS
-- ============================================
-- Mimi (Mèo Ba Tư)
INSERT INTO pet_images (pet_id, image_url, is_thumbnail, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91', true, 1
FROM pets p WHERE p.name = 'Mimi' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Mèo');

INSERT INTO pet_images (pet_id, image_url, is_thumbnail, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42', false, 2
FROM pets p WHERE p.name = 'Mimi' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Mèo');

-- Simba (Mèo Anh Lông Ngắn)
INSERT INTO pet_images (pet_id, image_url, is_thumbnail, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1551717743-49959800b1f6', true, 1
FROM pets p WHERE p.name = 'Simba' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Mèo');

INSERT INTO pet_images (pet_id, image_url, is_thumbnail, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1574158622682-e40e69881006', false, 2
FROM pets p WHERE p.name = 'Simba' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Mèo');

INSERT INTO pet_images (pet_id, image_url, is_thumbnail, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e', false, 3
FROM pets p WHERE p.name = 'Simba' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Mèo');

-- Nala (Mèo Xiêm)
INSERT INTO pet_images (pet_id, image_url, is_thumbnail, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8', true, 1
FROM pets p WHERE p.name = 'Nala' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Mèo');

INSERT INTO pet_images (pet_id, image_url, is_thumbnail, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1573865526739-10c1d3a1f0cc', false, 2
FROM pets p WHERE p.name = 'Nala' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Mèo');

-- Leo (Mèo Maine Coon)
INSERT INTO pet_images (pet_id, image_url, is_thumbnail, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1568152950566-c1bf43f4ab28', true, 1
FROM pets p WHERE p.name = 'Leo' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Mèo');

INSERT INTO pet_images (pet_id, image_url, is_thumbnail, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1615789591457-74a63395c990', false, 2
FROM pets p WHERE p.name = 'Leo' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Mèo');

-- Mochi (Mèo Munchkin)
INSERT INTO pet_images (pet_id, image_url, is_thumbnail, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1543852786-1cf6624b9987', true, 1
FROM pets p WHERE p.name = 'Mochi' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Mèo');

INSERT INTO pet_images (pet_id, image_url, is_thumbnail, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba', false, 2
FROM pets p WHERE p.name = 'Mochi' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Mèo');

INSERT INTO pet_images (pet_id, image_url, is_thumbnail, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2', false, 3
FROM pets p WHERE p.name = 'Mochi' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Mèo');

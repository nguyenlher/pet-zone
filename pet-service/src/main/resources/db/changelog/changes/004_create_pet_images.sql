-- ============================================
-- CREATE PET_PRODUCT_IMAGES TABLE (UNIFIED FOR PETS AND PET PRODUCTS)
-- ============================================
CREATE TABLE IF NOT EXISTS pet_product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(20),
    entity_id UUID NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    is_thumbnail BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_pet_product_images_entity ON pet_product_images(entity_type, entity_id);
CREATE INDEX idx_pet_product_images_display_order ON pet_product_images(entity_type, entity_id, display_order);
CREATE INDEX idx_pet_product_images_thumbnail ON pet_product_images(entity_type, entity_id, is_thumbnail) WHERE is_thumbnail = TRUE;

-- Ensure only one thumbnail per entity
CREATE UNIQUE INDEX idx_pet_product_images_one_thumbnail ON pet_product_images(entity_type, entity_id) WHERE is_thumbnail = TRUE;


-- ============================================
-- INSERT SAMPLE PET IMAGES FOR DOGS
-- ============================================
-- Hachi (Shiba Inu)
INSERT INTO pet_product_images (entity_type, entity_id, image_url, is_thumbnail, display_order)
SELECT 'PET', p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778158480/super-petmark-3d/images/shiba_evmx7h.jpg', true, 1
FROM pets p WHERE p.name = 'Hachi' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Chó');

-- Rocky (Corgi)
INSERT INTO pet_product_images (entity_type, entity_id, image_url, is_thumbnail, display_order)
SELECT 'PET', p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778158482/super-petmark-3d/images/Corgi_hdu868.jpg', true, 1
FROM pets p WHERE p.name = 'Rocky' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Chó');

-- Max (Golden Retriever)
INSERT INTO pet_product_images (entity_type, entity_id, image_url, is_thumbnail, display_order)
SELECT 'PET', p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778158475/super-petmark-3d/images/golden_retrieve_dtcl8d.jpg', true, 1
FROM pets p WHERE p.name = 'Max' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Chó');

-- Snow (Samoyed)
INSERT INTO pet_product_images (entity_type, entity_id, image_url, is_thumbnail, display_order)
SELECT 'PET', p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778158473/super-petmark-3d/images/Samoyed_xicjs9.jpg', true, 1
FROM pets p WHERE p.name = 'Snow' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Chó');

-- Tiny (Chihuahua)
INSERT INTO pet_product_images (entity_type, entity_id, image_url, is_thumbnail, display_order)
SELECT 'PET', p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778158481/super-petmark-3d/images/chiquaqua_wpfjzh.jpg', true, 1
FROM pets p WHERE p.name = 'Tiny' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Chó');

-- Oscar (Dachshund)
INSERT INTO pet_product_images (entity_type, entity_id, image_url, is_thumbnail, display_order)
SELECT 'PET', p.id, 'https://placeholder-dachshund.jpg', true, 1
FROM pets p WHERE p.name = 'Oscar' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Chó');

-- Luna (Husky)
INSERT INTO pet_product_images (entity_type, entity_id, image_url, is_thumbnail, display_order)
SELECT 'PET', p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778158480/super-petmark-3d/images/Dachshund_hakthj.jpg', true, 1
FROM pets p WHERE p.name = 'Luna' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Chó');

-- Buddy (Labrador)
INSERT INTO pet_product_images (entity_type, entity_id, image_url, is_thumbnail, display_order)
SELECT 'PET', p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778158476/super-petmark-3d/images/Labrador-Retriever_rywopc.jpg', true, 1
FROM pets p WHERE p.name = 'Buddy' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Chó');

-- Fluffy (Pomeranian)
INSERT INTO pet_product_images (entity_type, entity_id, image_url, is_thumbnail, display_order)
SELECT 'PET', p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778158481/super-petmark-3d/images/white-pomeranian_jctzhm.jpg', true, 1
FROM pets p WHERE p.name = 'Fluffy' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Chó');

-- Charlie (Poodle)
INSERT INTO pet_product_images (entity_type, entity_id, image_url, is_thumbnail, display_order)
SELECT 'PET', p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778158483/super-petmark-3d/images/poodle-toy_yc2fsp.jpg', true, 1
FROM pets p WHERE p.name = 'Charlie' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Chó');

-- Puggy (Pug)
INSERT INTO pet_product_images (entity_type, entity_id, image_url, is_thumbnail, display_order)
SELECT 'PET', p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778158482/super-petmark-3d/images/pug_qhz84j.jpg', true, 1
FROM pets p WHERE p.name = 'Puggy' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Chó');


-- ============================================
-- INSERT SAMPLE PET IMAGES FOR CATS
-- ============================================
-- Simba (British Shorthair)
INSERT INTO pet_product_images (entity_type, entity_id, image_url, is_thumbnail, display_order)
SELECT 'PET', p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778158478/super-petmark-3d/images/british-shorthair_irezka.jpg', true, 1
FROM pets p WHERE p.name = 'Simba' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Mèo');

-- Mochi (Munchkin)
INSERT INTO pet_product_images (entity_type, entity_id, image_url, is_thumbnail, display_order)
SELECT 'PET', p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778158474/super-petmark-3d/images/Munchkin_hjtqoc.jpg', true, 1
FROM pets p WHERE p.name = 'Mochi' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Mèo');

-- Angel (Ragdoll)
INSERT INTO pet_product_images (entity_type, entity_id, image_url, is_thumbnail, display_order)
SELECT 'PET', p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778158476/super-petmark-3d/images/Ragdoll_vuy80r.jpg', true, 1
FROM pets p WHERE p.name = 'Angel' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Mèo');

-- Nala (Siamese)
INSERT INTO pet_product_images (entity_type, entity_id, image_url, is_thumbnail, display_order)
SELECT 'PET', p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778158478/super-petmark-3d/images/siamese_dnxdkz.jpg', true, 1
FROM pets p WHERE p.name = 'Nala' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Mèo');

-- Tiger (Bengal)
INSERT INTO pet_product_images (entity_type, entity_id, image_url, is_thumbnail, display_order)
SELECT 'PET', p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778158475/super-petmark-3d/images/Bengal_kjp3xt.jpg', true, 1
FROM pets p WHERE p.name = 'Tiger' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Mèo');

-- Leo (Maine Coon)
INSERT INTO pet_product_images (entity_type, entity_id, image_url, is_thumbnail, display_order)
SELECT 'PET', p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778158475/super-petmark-3d/images/maine-coon_zqrnxg.jpg', true, 1
FROM pets p WHERE p.name = 'Leo' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Mèo');

-- Blue (Russian Blue)
INSERT INTO pet_product_images (entity_type, entity_id, image_url, is_thumbnail, display_order)
SELECT 'PET', p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778158477/super-petmark-3d/images/russian-blue_cbxmae.jpg', true, 1
FROM pets p WHERE p.name = 'Blue' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Mèo');

-- Foldy (Scottish Fold)
INSERT INTO pet_product_images (entity_type, entity_id, image_url, is_thumbnail, display_order)
SELECT 'PET', p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778158475/super-petmark-3d/images/Scottish-Fold_d3c4ht.jpg', true, 1
FROM pets p WHERE p.name = 'Foldy' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Mèo');

-- ============================================
-- CREATE PET_3D_MODELS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS pet_3d_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id UUID NOT NULL,
    model_url VARCHAR(500) NOT NULL,
    source_image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_pet_3d_models_pet FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_pet_3d_models_pet_id ON pet_3d_models(pet_id);
CREATE INDEX idx_pet_3d_models_created_at ON pet_3d_models(created_at DESC);

-- ============================================
-- INSERT SAMPLE 3D MODELS FOR DOGS
-- ============================================
-- Hachi (Shiba Inu)
INSERT INTO pet_3d_models (pet_id, model_url, source_image_url)
SELECT p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159256/super-petmark-3d/models/shiba-inu_dqqv4g.glb', 'https://placeholder-shiba-1.jpg'
FROM pets p WHERE p.name = 'Hachi' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Chó');

-- Rocky (Corgi)
INSERT INTO pet_3d_models (pet_id, model_url, source_image_url)
SELECT p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159266/super-petmark-3d/models/corgi_qwrdc2.glb', 'https://placeholder-corgi-1.jpg'
FROM pets p WHERE p.name = 'Rocky' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Chó');

-- Max (Golden Retriever)
INSERT INTO pet_3d_models (pet_id, model_url, source_image_url)
SELECT p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159199/super-petmark-3d/models/golden-retriever_lxpgzf.glb', 'https://placeholder-golden-1.jpg'
FROM pets p WHERE p.name = 'Max' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Chó');

-- Snow (Samoyed)
INSERT INTO pet_3d_models (pet_id, model_url, source_image_url)
SELECT p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159274/super-petmark-3d/models/Samoyed_lrr4ia.glb', 'https://placeholder-samoyed-1.jpg'
FROM pets p WHERE p.name = 'Snow' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Chó');

-- Tiny (Chihuahua)
INSERT INTO pet_3d_models (pet_id, model_url, source_image_url)
SELECT p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159260/super-petmark-3d/models/chihuahua_phf6gb.glb', 'https://placeholder-chihuahua-1.jpg'
FROM pets p WHERE p.name = 'Tiny' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Chó');

-- Oscar (Dachshund)
INSERT INTO pet_3d_models (pet_id, model_url, source_image_url)
SELECT p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159254/super-petmark-3d/models/dachshund_udwoo6.glb', 'https://placeholder-dachshund-1.jpg'
FROM pets p WHERE p.name = 'Oscar' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Chó');

-- Luna (Husky)
INSERT INTO pet_3d_models (pet_id, model_url, source_image_url)
SELECT p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159204/super-petmark-3d/models/Husky-Siberian_jxsfwe.glb', 'https://placeholder-husky-1.jpg'
FROM pets p WHERE p.name = 'Luna' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Chó');

-- Buddy (Labrador)
INSERT INTO pet_3d_models (pet_id, model_url, source_image_url)
SELECT p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159196/super-petmark-3d/models/Labrador-Retriever_jd6tp6.glb', 'https://placeholder-labrador-1.jpg'
FROM pets p WHERE p.name = 'Buddy' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Chó');

-- Fluffy (Pomeranian)
INSERT INTO pet_3d_models (pet_id, model_url, source_image_url)
SELECT p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159262/super-petmark-3d/models/Pomeranian_zkuyuh.glb', 'https://placeholder-pomeranian-1.jpg'
FROM pets p WHERE p.name = 'Fluffy' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Chó');

-- Charlie (Poodle)
INSERT INTO pet_3d_models (pet_id, model_url, source_image_url)
SELECT p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159274/super-petmark-3d/models/poodle-toy_bho9ef.glb', 'https://placeholder-poodle-1.jpg'
FROM pets p WHERE p.name = 'Charlie' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Chó');

-- Puggy (Pug)
INSERT INTO pet_3d_models (pet_id, model_url, source_image_url)
SELECT p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159253/super-petmark-3d/models/pug-dog_zocm3k.glb', 'https://placeholder-pug-1.jpg'
FROM pets p WHERE p.name = 'Puggy' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Chó');

-- ============================================
-- INSERT SAMPLE 3D MODELS FOR CATS
-- ============================================
-- Simba (British Shorthair)
INSERT INTO pet_3d_models (pet_id, model_url, source_image_url)
SELECT p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159247/super-petmark-3d/models/British-Shorthair_iavz1a.glb', 'https://placeholder-british-shorthair-1.jpg'
FROM pets p WHERE p.name = 'Simba' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Mèo');

-- Mochi (Munchkin)
INSERT INTO pet_3d_models (pet_id, model_url, source_image_url)
SELECT p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159221/super-petmark-3d/models/Munchkin_rozzad.glb', 'https://placeholder-munchkin-1.jpg'
FROM pets p WHERE p.name = 'Mochi' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Mèo');

-- Angel (Ragdoll)
INSERT INTO pet_3d_models (pet_id, model_url, source_image_url)
SELECT p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159220/super-petmark-3d/models/Ragdoll_pyvm5i.glb', 'https://placeholder-ragdoll-1.jpg'
FROM pets p WHERE p.name = 'Angel' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Mèo');

-- Nala (Siamese)
INSERT INTO pet_3d_models (pet_id, model_url, source_image_url)
SELECT p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159226/super-petmark-3d/models/siamese_lxgcpz.glb', 'https://placeholder-siamese-1.jpg'
FROM pets p WHERE p.name = 'Nala' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Mèo');

-- Tiger (Bengal)
INSERT INTO pet_3d_models (pet_id, model_url, source_image_url)
SELECT p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159203/super-petmark-3d/models/Bengal_zdcpjp.glb', 'https://placeholder-bengal-1.jpg'
FROM pets p WHERE p.name = 'Tiger' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Mèo');

-- Leo (Maine Coon)
INSERT INTO pet_3d_models (pet_id, model_url, source_image_url)
SELECT p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159229/super-petmark-3d/models/maine-coon_eum3p4.glb', 'https://placeholder-maine-coon-1.jpg'
FROM pets p WHERE p.name = 'Leo' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Mèo');

-- Blue (Russian Blue)
INSERT INTO pet_3d_models (pet_id, model_url, source_image_url)
SELECT p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159228/super-petmark-3d/models/russian-blue_vtat8m.glb', 'https://placeholder-russian-blue-1.jpg'
FROM pets p WHERE p.name = 'Blue' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Mèo');

-- Foldy (Scottish Fold)
INSERT INTO pet_3d_models (pet_id, model_url, source_image_url)
SELECT p.id, 'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778159212/super-petmark-3d/models/Scottish-Fold_n6vy3q.glb', 'https://placeholder-scottish-fold-1.jpg'
FROM pets p WHERE p.name = 'Foldy' AND EXISTS (SELECT 1 FROM pet_types pt WHERE pt.id = p.type_id AND pt.name = 'Mèo');

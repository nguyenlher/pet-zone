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

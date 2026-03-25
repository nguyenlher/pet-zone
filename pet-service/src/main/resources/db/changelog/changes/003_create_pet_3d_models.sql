CREATE TABLE IF NOT EXISTS pet_3d_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id UUID NOT NULL UNIQUE REFERENCES pets(id) ON DELETE CASCADE,
    model_url TEXT,
    source_image_url TEXT,
    thumbnail_url TEXT,
    ai_generated BOOLEAN DEFAULT FALSE,
    confidence_score DECIMAL(3,2),
    generated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_3d_pet_id ON pet_3d_models(pet_id);
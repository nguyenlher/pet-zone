CREATE TABLE IF NOT EXISTS breeds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    pet_type VARCHAR(50) NOT NULL CHECK (pet_type IN ('dog', 'cat')),
    group_name VARCHAR(255),
    description TEXT,
    origin_country VARCHAR(100),
    size_category VARCHAR(50) CHECK (size_category IN ('small', 'medium', 'large')),
    avg_weight_min DECIMAL(5,2),
    avg_weight_max DECIMAL(5,2),
    avg_height_min DECIMAL(5,2),
    avg_height_max DECIMAL(5,2),
    common_colors TEXT,
    coat_type VARCHAR(50),
    shedding_level INTEGER CHECK (shedding_level BETWEEN 1 AND 5),
    typical_energy INTEGER CHECK (typical_energy BETWEEN 1 AND 5),
    typical_trainability INTEGER CHECK (typical_trainability BETWEEN 1 AND 5),
    good_with_children INTEGER CHECK (good_with_children BETWEEN 1 AND 5),
    good_with_pets INTEGER CHECK (good_with_pets BETWEEN 1 AND 5),
    barking_level INTEGER CHECK (barking_level BETWEEN 1 AND 5),
    grooming_needs VARCHAR(50) CHECK (grooming_needs IN ('low', 'medium', 'high')),
    exercise_needs VARCHAR(50) CHECK (exercise_needs IN ('low', 'medium', 'high')),
    model_3d_template_url TEXT,
    ai_prompt_keywords JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    image_url TEXT,
    icon_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_breeds_pet_type ON breeds(pet_type);
CREATE INDEX idx_breeds_name ON breeds(name);
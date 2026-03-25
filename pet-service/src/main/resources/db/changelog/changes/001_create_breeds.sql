CREATE TABLE IF NOT EXISTS breeds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    pet_type VARCHAR(50) NOT NULL,
    description TEXT,
    origin_country VARCHAR(100),
    avg_weight_min DECIMAL(5,2),
    avg_weight_max DECIMAL(5,2),
    avg_height_min DECIMAL(5,2),
    avg_height_max DECIMAL(5,2),
    common_colors TEXT,
    life_expectancy VARCHAR(50),
    avg_rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    image_url TEXT,
    model_3d_template_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_breeds_pet_type ON breeds(pet_type);
CREATE INDEX idx_breeds_name ON breeds(name);
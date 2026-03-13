CREATE TABLE IF NOT EXISTS pets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- BASIC INFO
    name VARCHAR(255) NOT NULL,
    pet_type VARCHAR(50) NOT NULL CHECK (pet_type IN ('dog', 'cat')),
    breed_primary_id UUID REFERENCES breeds(id),
    breed_secondary_id UUID REFERENCES breeds(id),
    gender VARCHAR(50) CHECK (gender IN ('male', 'female')),
    birth_date DATE,
    birth_date_accuracy VARCHAR(50) CHECK (birth_date_accuracy IN ('exact', 'estimated_month', 'estimated_year')),
    
    -- PHYSICAL ATTRIBUTES
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    length DECIMAL(5,2),
    colors JSONB,
    color_pattern VARCHAR(100),
    fur_type VARCHAR(100),
    
    -- FACE FEATURES
    face_shape VARCHAR(100),
    eye_color VARCHAR(100),
    eye_shape VARCHAR(100),
    ear_type VARCHAR(100),
    muzzle_length VARCHAR(100),
    
    -- BODY FEATURES
    body_shape VARCHAR(100),
    leg_length VARCHAR(100),
    tail_type VARCHAR(100),
    distinctive_features JSONB,
    
    -- HEALTH
    health_status VARCHAR(100),
    spayed_neutered BOOLEAN DEFAULT FALSE,
    vaccinated BOOLEAN DEFAULT FALSE,
    dewormed BOOLEAN DEFAULT FALSE,
    last_checkup_date DATE,
    allergies JSONB,
    chronic_conditions JSONB,
    
    -- BEHAVIOR
    energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 5),
    sociability INTEGER CHECK (sociability BETWEEN 1 AND 5),
    child_friendly INTEGER CHECK (child_friendly BETWEEN 1 AND 5),
    pet_friendly INTEGER CHECK (pet_friendly BETWEEN 1 AND 5),
    trainability INTEGER CHECK (trainability BETWEEN 1 AND 5),
    barking_tendency INTEGER CHECK (barking_tendency BETWEEN 1 AND 5),
    separation_anxiety INTEGER CHECK (separation_anxiety BETWEEN 1 AND 5),
    commands JSONB,
    favorite_activities JSONB,
    
    -- AI 3D MODEL
    model_3d_url_glb TEXT,
    model_3d_url_obj TEXT,
    model_texture_url TEXT,
    model_thumbnail_url TEXT,
    model_source_image_url TEXT,
    model_ai_generated BOOLEAN DEFAULT FALSE,
    model_confidence_score DECIMAL(3,2),
    model_generated_at TIMESTAMP WITH TIME ZONE,
    
    -- AI GENERATED CONTENT
    ai_description TEXT,
    ai_tags JSONB,
    ai_price_suggestion DECIMAL(10,2),
    
    -- PRICE
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    negotiable BOOLEAN DEFAULT FALSE,
    available_from DATE,
    available_to DATE,
    
    -- LOCATION
    city VARCHAR(255),
    district VARCHAR(255),
    address_detail TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    
    -- STATUS
    status VARCHAR(50) NOT NULL CHECK (status IN ('available', 'sold', 'reserved', 'withdrawn', 'draft')),
    is_featured BOOLEAN DEFAULT FALSE,
    featured_until DATE,
    promotion_badges JSONB,
    
    -- METRICS
    view_count INTEGER DEFAULT 0,
    favorite_count INTEGER DEFAULT 0,
    inquiry_count INTEGER DEFAULT 0,
    
    -- AUDIT
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES
CREATE INDEX idx_pets_type ON pets(pet_type);
CREATE INDEX idx_pets_status ON pets(status);
CREATE INDEX idx_pets_breed ON pets(breed_primary_id);
CREATE INDEX idx_pets_name ON pets(name);
CREATE INDEX idx_pets_city ON pets(city);
CREATE INDEX idx_pets_price ON pets(price);
CREATE INDEX idx_pets_created ON pets(created_at);
CREATE INDEX idx_pets_featured ON pets(is_featured) WHERE is_featured = TRUE;
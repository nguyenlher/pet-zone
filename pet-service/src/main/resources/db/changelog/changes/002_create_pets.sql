CREATE TABLE IF NOT EXISTS pets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- BASIC INFO
    name VARCHAR(255) NOT NULL,
    pet_type VARCHAR(50) NOT NULL,
    breed_id UUID REFERENCES breeds(id),
    gender VARCHAR(50) NOT NULL,
    birth_date DATE,
    
    -- PHYSICAL ATTRIBUTES
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    colors JSONB,
    color_pattern VARCHAR(50),
    fur_type VARCHAR(50),
    
    -- HEALTH
    health_status VARCHAR(50),
    vaccinated BOOLEAN DEFAULT FALSE,
    
    -- BUSINESS
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL,
    
    -- MEDIA
    thumbnail_url TEXT,
    image_urls JSONB,
    
    -- AI GENERATED
    ai_description TEXT,
    
    -- METRICS
    view_count INTEGER DEFAULT 0,
    
    -- AUDIT
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pets_type ON pets(pet_type);
CREATE INDEX idx_pets_status ON pets(status);
CREATE INDEX idx_pets_breed ON pets(breed_id);
CREATE INDEX idx_pets_name ON pets(name);
CREATE INDEX idx_pets_price ON pets(price);
CREATE INDEX idx_pets_created ON pets(created_at);
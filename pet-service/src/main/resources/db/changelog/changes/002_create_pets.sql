CREATE TABLE IF NOT EXISTS pets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- BASIC INFO
    name VARCHAR(255) NOT NULL,
    breed_id UUID REFERENCES breeds(id),
    gender VARCHAR(50) NOT NULL,
    birth_date DATE,
    
    -- PHYSICAL ATTRIBUTES
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    colors JSONB,  -- List<String> lưu dạng JSONB
    fur_type VARCHAR(50),
    
    -- HEALTH
    health_status VARCHAR(50),
    vaccinated BOOLEAN DEFAULT FALSE,
    
    -- BUSINESS
    price DECIMAL(19,2) NOT NULL,  -- precision=19, scale=2
    description TEXT,
    status VARCHAR(50) NOT NULL,
    
    -- METRICS
    view_count INTEGER DEFAULT 0,
    
    -- AUDIT
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pets_status ON pets(status);
CREATE INDEX idx_pets_breed ON pets(breed_id);
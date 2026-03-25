CREATE TABLE IF NOT EXISTS breed_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    breed_id UUID NOT NULL REFERENCES breeds(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(breed_id, user_id)
);

CREATE INDEX idx_reviews_breed ON breed_reviews(breed_id);
CREATE INDEX idx_reviews_user ON breed_reviews(user_id);
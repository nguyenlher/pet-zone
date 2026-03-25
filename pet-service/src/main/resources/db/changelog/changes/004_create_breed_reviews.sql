CREATE TABLE IF NOT EXISTS breed_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    breed_id UUID NOT NULL REFERENCES breeds(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    rating_friendly INTEGER CHECK (rating_friendly BETWEEN 1 AND 5),
    rating_health INTEGER CHECK (rating_health BETWEEN 1 AND 5),
    rating_train INTEGER CHECK (rating_train BETWEEN 1 AND 5),
    rating_kids INTEGER CHECK (rating_kids BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_breed ON breed_reviews(breed_id);
CREATE INDEX idx_reviews_user ON breed_reviews(user_id);
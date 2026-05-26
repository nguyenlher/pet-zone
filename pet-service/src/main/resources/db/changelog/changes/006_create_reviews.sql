-- ============================================
-- CREATE REVIEWS TABLE (FOR PETS, BREEDS AND PET PRODUCTS)
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('PET', 'BREED', 'PET_PRODUCT')),
    entity_id UUID NOT NULL,
    user_id UUID NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_reviews_entity ON reviews(entity_type, entity_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(entity_type, entity_id, rating DESC);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

-- Ensure one review per user per entity
CREATE UNIQUE INDEX idx_reviews_unique_user ON reviews(entity_type, entity_id, user_id);

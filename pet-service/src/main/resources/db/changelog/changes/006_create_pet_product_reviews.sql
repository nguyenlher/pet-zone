-- ============================================
-- CREATE PET_PRODUCT_REVIEWS TABLE (FOR BREEDS AND PET PRODUCTS)
-- ============================================
CREATE TABLE IF NOT EXISTS pet_product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('BREED', 'PET_PRODUCT')),
    entity_id UUID NOT NULL,
    customer_id UUID NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_pet_product_reviews_entity ON pet_product_reviews(entity_type, entity_id);
CREATE INDEX idx_pet_product_reviews_customer_id ON pet_product_reviews(customer_id);
CREATE INDEX idx_pet_product_reviews_rating ON pet_product_reviews(entity_type, entity_id, rating DESC);
CREATE INDEX idx_pet_product_reviews_created_at ON pet_product_reviews(created_at DESC);

-- Ensure one review per customer per entity
CREATE UNIQUE INDEX idx_pet_product_reviews_unique_customer ON pet_product_reviews(entity_type, entity_id, customer_id);

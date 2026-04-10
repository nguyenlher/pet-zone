-- ============================================
-- CREATE PET_TYPES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS pet_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    icon_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_pet_types_is_active ON pet_types(is_active);
CREATE INDEX idx_pet_types_display_order ON pet_types(display_order);

-- Insert default pet types
INSERT INTO pet_types (name, description, is_active, display_order, created_at, updated_at)
VALUES 
    ('Chó', 'Thú cưng trung thành, thân thiện và năng động', true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Mèo', 'Thú cưng độc lập, dễ thương và thông minh', true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Chim', 'Thú cưng nhỏ nhắn, đa dạng màu sắc', true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Cá', 'Thú cưng trang trí, dễ chăm sóc', true, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Hamster', 'Thú cưng nhỏ, dễ thương và dễ nuôi', true, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

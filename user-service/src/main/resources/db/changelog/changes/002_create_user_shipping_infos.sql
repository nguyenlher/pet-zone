-- ============================================
-- CREATE USER_SHIPPING_INFOS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_shipping_infos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    phone_number VARCHAR(20),
    address TEXT NOT NULL,
    district VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    note TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_shipping_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_shipping_user_id ON user_shipping_infos(user_id);
CREATE INDEX IF NOT EXISTS idx_user_shipping_is_default ON user_shipping_infos(is_default);

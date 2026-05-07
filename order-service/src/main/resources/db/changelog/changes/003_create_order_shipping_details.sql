-- ============================================
-- CREATE ORDER_SHIPPING_DETAILS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS order_shipping_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    payment_method VARCHAR(50),
    
    CONSTRAINT fk_order_shipping_details_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_order_shipping_details_order_id ON order_shipping_details(order_id);
CREATE INDEX idx_order_shipping_details_phone ON order_shipping_details(phone);

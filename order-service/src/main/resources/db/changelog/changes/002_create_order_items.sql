-- ============================================
-- CREATE ORDER_ITEMS TABLE (FOR PETS AND PRODUCTS)
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL,
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('PET', 'PRODUCT')),
    item_id UUID NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    subtotal_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_item ON order_items(item_type, item_id);
CREATE INDEX idx_order_items_created_at ON order_items(created_at DESC);

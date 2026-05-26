-- ============================================
-- CREATE PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100),
    category VARCHAR(50) NOT NULL,
    pet_type_id UUID,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    sold_count INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    avg_rating DECIMAL(3,2) NOT NULL DEFAULT 0.0,
    total_reviews INTEGER NOT NULL DEFAULT 0,
    view_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    
    -- CONSTRAINT fk_pet_products_pet_type FOREIGN KEY (pet_type_id) REFERENCES pet_types(id) ON DELETE SET NULL,
    -- CONSTRAINT chk_pet_products_category CHECK (category IN ('FOOD', 'ACCESSORY', 'CLOTHING', 'HOUSING', 'OTHER')),
    -- CONSTRAINT chk_pet_products_status CHECK (status IN ('AVAILABLE', 'OUT_OF_STOCK', 'DISCONTINUED')),
    -- CONSTRAINT chk_pet_products_price CHECK (price >= 0),
    -- CONSTRAINT chk_pet_products_stock_quantity CHECK (stock_quantity >= 0),
    -- CONSTRAINT chk_pet_products_sold_count CHECK (sold_count >= 0),
    -- CONSTRAINT chk_pet_products_avg_rating CHECK (avg_rating >= 0 AND avg_rating <= 5),
    -- CONSTRAINT chk_pet_products_total_reviews CHECK (total_reviews >= 0),
    -- CONSTRAINT chk_pet_products_view_count CHECK (view_count >= 0)
);

-- Indexes
CREATE INDEX idx_products_pet_type_id ON products(pet_type_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_avg_rating ON products(avg_rating DESC);
CREATE INDEX idx_products_sold_count ON products(sold_count DESC);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_products_view_count ON products(view_count DESC);

-- Full-text search index for name, brand and description
CREATE INDEX idx_products_name_trgm ON products USING gin(name gin_trgm_ops);
CREATE INDEX idx_products_brand_trgm ON products USING gin(brand gin_trgm_ops);
CREATE INDEX idx_products_description_trgm ON products USING gin(description gin_trgm_ops);

-- ============================================
-- INSERT SAMPLE DATA FOR DOG PRODUCTS
-- ============================================
INSERT INTO products (name, brand, category, pet_type_id, price, stock_quantity, sold_count, description, status, avg_rating, total_reviews, view_count, created_at, updated_at)
SELECT 
    product_name,
    product_brand,
    product_category,
    pt.id,
    product_price,
    product_stock,
    product_sold,
    product_description,
    product_status,
    product_rating,
    product_reviews,
    0,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM pet_types pt
CROSS JOIN (
    VALUES 
        -- Dog Food
        ('Thức ăn hạt Royal Canin cho chó trưởng thành', 'Royal Canin', 'FOOD', 450000.00, 100, 45, 'Thức ăn hạt cao cấp dành cho chó trưởng thành, giúp duy trì sức khỏe tối ưu. Bao 3kg.', 'AVAILABLE', 4.5, 12),
        ('Pate Pedigree vị gà cho chó', 'Pedigree', 'FOOD', 35000.00, 200, 120, 'Pate thơm ngon, bổ dưỡng cho chó mọi lứa tuổi. Hộp 400g.', 'AVAILABLE', 4.2, 35),
        ('Xương gặm sạch răng Dentastix', 'Pedigree', 'FOOD', 85000.00, 150, 78, 'Xương gặm giúp làm sạch răng, giảm mảng bám và hơi thở thơm mát. Hộp 7 que.', 'AVAILABLE', 4.7, 28),
        ('Thức ăn hạt Ganador cho chó con', 'Ganador', 'FOOD', 380000.00, 80, 32, 'Thức ăn hạt dinh dưỡng cho chó con dưới 1 tuổi. Bao 2.5kg.', 'AVAILABLE', 4.3, 15),
        ('Sữa bột Lactol cho chó con', 'Beaphar', 'FOOD', 250000.00, 60, 18, 'Sữa bột thay thế sữa mẹ cho chó con. Hộp 500g.', 'AVAILABLE', 4.6, 9),
        
        -- Dog Accessories
        ('Vòng cổ da cao cấp cho chó', 'Petkit', 'ACCESSORY', 180000.00, 50, 25, 'Vòng cổ da thật, bền đẹp, có thể điều chỉnh kích thước. Phù hợp chó trung bình.', 'AVAILABLE', 4.4, 8),
        ('Dây dắt chó tự động 5m', 'Flexi', 'ACCESSORY', 320000.00, 40, 22, 'Dây dắt tự động cuộn, chịu lực tốt, phù hợp chó dưới 20kg.', 'AVAILABLE', 4.5, 11),
        ('Bát ăn inox đôi có chân đế', 'Petkit', 'ACCESSORY', 150000.00, 70, 35, 'Bát ăn inox 2 ngăn, có chân đế chống trượt. Dễ vệ sinh.', 'AVAILABLE', 4.3, 14),
        ('Lược chải lông tự động', 'Furminator', 'ACCESSORY', 280000.00, 45, 19, 'Lược chải lông chuyên dụng, loại bỏ lông rụng hiệu quả. Phù hợp chó lông dài.', 'AVAILABLE', 4.8, 22),
        ('Đồ chơi bóng cao su phát tiếng', 'Kong', 'ACCESSORY', 95000.00, 100, 58, 'Bóng cao su bền, phát tiếng kêu khi cắn. Kích thước 7cm.', 'AVAILABLE', 4.1, 17),
        
        -- Dog Clothing
        ('Áo mưa cho chó size M', 'Touchdog', 'CLOTHING', 120000.00, 60, 28, 'Áo mưa chống thấm nước, có mũ trùm đầu. Phù hợp chó 5-10kg.', 'AVAILABLE', 4.0, 7),
        ('Áo len ấm cho chó mùa đông', 'Petkit', 'CLOTHING', 150000.00, 50, 22, 'Áo len dày dặn, giữ ấm tốt. Nhiều màu sắc. Size M.', 'AVAILABLE', 4.2, 9),
        ('Giày bảo vệ chân cho chó', 'Pawz', 'CLOTHING', 180000.00, 30, 8, 'Giày cao su mềm, bảo vệ chân chó khi đi ngoài trời. Bộ 4 chiếc.', 'AVAILABLE', 3.9, 5),
        
        -- Dog Housing
        ('Chuồng lồng sắt gấp gọn 60cm', 'Iris', 'HOUSING', 850000.00, 25, 12, 'Chuồng sắt chắc chắn, có thể gấp gọn. Kích thước 60x45x50cm.', 'AVAILABLE', 4.5, 6),
        ('Nệm nằm êm ái cho chó', 'Petkit', 'HOUSING', 280000.00, 40, 18, 'Nệm mềm mại, vải cotton thoáng mát. Kích thước 70x50cm.', 'AVAILABLE', 4.3, 8),
        ('Nhà gỗ ngoài trời cho chó', 'Merry Pet', 'HOUSING', 1500000.00, 15, 5, 'Nhà gỗ chắc chắn, chống mưa nắng. Kích thước 80x60x70cm.', 'AVAILABLE', 4.7, 4),
        
        -- Dog Other
        ('Khăn tắm siêu thấm cho chó', 'Soggy Doggy', 'OTHER', 180000.00, 50, 24, 'Khăn microfiber siêu thấm nước, nhanh khô. Kích thước 80x50cm.', 'AVAILABLE', 4.4, 10),
        ('Bàn chải đánh răng cho chó', 'Petrodex', 'OTHER', 65000.00, 80, 32, 'Bàn chải đánh răng chuyên dụng, đầu mềm. Kèm kem đánh răng vị gà.', 'AVAILABLE', 4.1, 12),
        ('Dầu tắm diệt ve rận cho chó', 'Bio-Groom', 'OTHER', 220000.00, 60, 28, 'Dầu tắm diệt ve rận, bọ chét hiệu quả. Chai 500ml.', 'AVAILABLE', 4.6, 15)
) AS dog_products(product_name, product_brand, product_category, product_price, product_stock, product_sold, product_description, product_status, product_rating, product_reviews)
WHERE pt.name = 'Chó';

-- ============================================
-- INSERT SAMPLE DATA FOR CAT PRODUCTS
-- ============================================
INSERT INTO products (name, brand, category, pet_type_id, price, stock_quantity, sold_count, description, status, avg_rating, total_reviews, view_count, created_at, updated_at)
SELECT 
    product_name,
    product_brand,
    product_category,
    pt.id,
    product_price,
    product_stock,
    product_sold,
    product_description,
    product_status,
    product_rating,
    product_reviews,
    0,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM pet_types pt
CROSS JOIN (
    VALUES 
        -- Cat Food
        ('Thức ăn hạt Royal Canin cho mèo trưởng thành', 'Royal Canin', 'FOOD', 420000.00, 90, 52, 'Thức ăn hạt cao cấp dành cho mèo trưởng thành, cân bằng dinh dưỡng. Bao 2kg.', 'AVAILABLE', 4.6, 18),
        ('Pate Whiskas vị cá ngừ', 'Whiskas', 'FOOD', 28000.00, 250, 145, 'Pate thơm ngon, bổ dưỡng cho mèo. Hộp 400g.', 'AVAILABLE', 4.3, 42),
        ('Snack Ciao Churu cho mèo', 'Ciao', 'FOOD', 45000.00, 180, 98, 'Snack dạng kem, bổ sung nước cho mèo. Hộp 4 tuýp.', 'AVAILABLE', 4.8, 35),
        ('Thức ăn hạt Me-O cho mèo con', 'Me-O', 'FOOD', 180000.00, 100, 45, 'Thức ăn hạt dinh dưỡng cho mèo con. Bao 1.2kg.', 'AVAILABLE', 4.2, 16),
        ('Sữa Catmilk cho mèo', 'Whiskas', 'FOOD', 35000.00, 120, 38, 'Sữa bổ sung dinh dưỡng cho mèo. Hộp 200ml.', 'AVAILABLE', 4.1, 11),
        
        -- Cat Accessories
        ('Vòng cổ có chuông cho mèo', 'Catit', 'ACCESSORY', 45000.00, 100, 48, 'Vòng cổ mềm mại, có chuông nhỏ và khóa an toàn.', 'AVAILABLE', 4.0, 12),
        ('Khay vệ sinh cho mèo có nắp', 'Catit', 'ACCESSORY', 280000.00, 50, 28, 'Khay vệ sinh kín, chống mùi, có cửa ra vào. Kích thước 50x40x40cm.', 'AVAILABLE', 4.5, 14),
        ('Cát vệ sinh Bentonite 10L', 'Cat''s Best', 'ACCESSORY', 120000.00, 150, 85, 'Cát vệ sinh vón cục, khử mùi tốt. Túi 10L.', 'AVAILABLE', 4.4, 28),
        ('Bát ăn gốm sứ cho mèo', 'Catit', 'ACCESSORY', 85000.00, 80, 42, 'Bát ăn gốm sứ cao cấp, chống trượt. Đường kính 12cm.', 'AVAILABLE', 4.3, 15),
        ('Cần câu đồ chơi cho mèo', 'Catit', 'ACCESSORY', 65000.00, 120, 68, 'Cần câu có lông vũ, kích thích bản năng săn mồi của mèo.', 'AVAILABLE', 4.6, 22),
        ('Bàn cào móng cho mèo', 'Catit', 'ACCESSORY', 180000.00, 60, 32, 'Bàn cào móng bằng bìa cứng, bảo vệ đồ đạc. Kích thước 40x20cm.', 'AVAILABLE', 4.5, 18),
        
        -- Cat Clothing
        ('Áo len cho mèo Sphynx', 'Petkit', 'CLOTHING', 120000.00, 30, 8, 'Áo len ấm áp dành cho mèo không lông. Size S.', 'AVAILABLE', 4.2, 4),
        ('Băng đô tai thỏ cho mèo', 'Petkit', 'CLOTHING', 35000.00, 80, 45, 'Băng đô đáng yêu, dễ đeo. Phù hợp chụp ảnh.', 'AVAILABLE', 3.8, 9),
        
        -- Cat Housing
        ('Nhà cây cho mèo 3 tầng', 'Catit', 'HOUSING', 1200000.00, 20, 9, 'Nhà cây cao 120cm, có 3 tầng, ống chui và võng nằm.', 'AVAILABLE', 4.7, 7),
        ('Túi ngủ ấm áp cho mèo', 'Petkit', 'HOUSING', 180000.00, 50, 28, 'Túi ngủ mềm mại, giữ ấm tốt. Kích thước 50x40cm.', 'AVAILABLE', 4.4, 12),
        ('Lồng vận chuyển cho mèo', 'Catit', 'HOUSING', 350000.00, 40, 22, 'Lồng nhựa chắc chắn, có cửa sắt. Kích thước 50x35x35cm.', 'AVAILABLE', 4.3, 10),
        
        -- Cat Other
        ('Lược chải lông cho mèo', 'Catit', 'OTHER', 85000.00, 90, 48, 'Lược chải lông mềm, loại bỏ lông rụng hiệu quả.', 'AVAILABLE', 4.2, 16),
        ('Dầu tắm cho mèo lông dài', 'Bio-Groom', 'OTHER', 180000.00, 60, 25, 'Dầu tắm dưỡng lông, giảm rối lông. Chai 350ml.', 'AVAILABLE', 4.5, 11),
        ('Kẹp cắt móng cho mèo', 'Catit', 'OTHER', 55000.00, 100, 52, 'Kẹp cắt móng chuyên dụng, sắc bén, an toàn.', 'AVAILABLE', 4.1, 14),
        ('Catnip khô kích thích mèo', 'Catit', 'OTHER', 45000.00, 150, 88, 'Cỏ bạc hà khô, kích thích mèo vui chơi. Túi 20g.', 'AVAILABLE', 4.7, 25)
) AS cat_products(product_name, product_brand, product_category, product_price, product_stock, product_sold, product_description, product_status, product_rating, product_reviews)
WHERE pt.name = 'Mèo';

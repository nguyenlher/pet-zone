-- ============================================
-- INSERT DATA FOR BREEDS
-- ============================================
INSERT INTO breeds (id, name, pet_type, description, avg_rating, total_reviews, image_url, is_active, created_at, updated_at) 
VALUES 
(gen_random_uuid(), 'Phoc soc', 'DOG', 'Cho nho thong minh, de thuong', 4.5, 10, 'https://example.com/phoc-soc.jpg', true, now(), now()),
(gen_random_uuid(), 'Husky', 'DOG', 'Cho keo xe, nang dong', 4.8, 20, 'https://example.com/husky.jpg', true, now(), now()),
(gen_random_uuid(), 'Poodle', 'DOG', 'Thong minh, it rung long', 4.9, 25, 'https://example.com/poodle.jpg', true, now(), now()),
(gen_random_uuid(), 'Meo Ba Tu', 'CAT', 'Long dai, hien lanh', 4.7, 15, 'https://example.com/meo-ba-tu.jpg', true, now(), now()),
(gen_random_uuid(), 'Meo Anh long ngan', 'CAT', 'De thuong, than thien', 4.6, 12, 'https://example.com/british-shorthair.jpg', true, now(), now());

-- ============================================
-- INSERT DATA FOR PETS
-- ============================================
INSERT INTO pets (
    id, name, breed_id, gender, birth_date, weight, height, colors, 
    fur_type, health_status, vaccinated, price, description, status, 
    view_count, created_at, updated_at
)
SELECT 
    gen_random_uuid(),
    name,
    breed_id,
    gender,
    birth_date::date,
    weight,
    height,
    colors::jsonb,
    fur_type,
    health_status,
    vaccinated,
    price,
    description,
    status,
    0,
    now(),
    now()
FROM (VALUES
    ('Lucky', (SELECT id FROM breeds WHERE name = 'Phoc soc' LIMIT 1), 'MALE', '2023-01-01', 3.5, 25.0, '["vang", "trang"]', 'SHORT', 'EXCELLENT', true, 5000000, 'Cho phoc soc de thuong', 'AVAILABLE'),
    ('Max', (SELECT id FROM breeds WHERE name = 'Husky' LIMIT 1), 'MALE', '2023-03-10', 18.0, 55.0, '["xam", "trang"]', 'MEDIUM', 'EXCELLENT', true, 12000000, 'Husky thuan chung', 'AVAILABLE'),
    ('Bella', (SELECT id FROM breeds WHERE name = 'Poodle' LIMIT 1), 'FEMALE', '2023-05-20', 2.8, 35.0, '["nau"]', 'CURLY', 'EXCELLENT', true, 6500000, 'Poodle long xoan', 'AVAILABLE'),
    ('Charlie', (SELECT id FROM breeds WHERE name = 'Phoc soc' LIMIT 1), 'MALE', '2023-07-15', 3.2, 24.0, '["nau", "den"]', 'SHORT', 'GOOD', true, 4800000, 'Phoc soc den nau', 'AVAILABLE'),
    ('Luna', (SELECT id FROM breeds WHERE name = 'Husky' LIMIT 1), 'FEMALE', '2022-12-01', 16.5, 52.0, '["trang", "xam"]', 'MEDIUM', 'EXCELLENT', true, 11000000, 'Husky cai xinh dep', 'AVAILABLE'),
    ('Mimi', (SELECT id FROM breeds WHERE name = 'Meo Ba Tu' LIMIT 1), 'FEMALE', '2022-06-15', 4.2, 30.0, '["trang", "kem"]', 'LONG', 'EXCELLENT', true, 8000000, 'Meo Ba Tu thuan chung', 'AVAILABLE'),
    ('Tom', (SELECT id FROM breeds WHERE name = 'Meo Anh long ngan' LIMIT 1), 'MALE', '2022-10-01', 5.0, 25.0, '["xam", "xanh"]', 'SHORT', 'GOOD', true, 7000000, 'Meo Anh long ngan', 'AVAILABLE'),
    ('Simba', (SELECT id FROM breeds WHERE name = 'Meo Ba Tu' LIMIT 1), 'MALE', '2023-02-20', 3.8, 28.0, '["cam", "trang"]', 'LONG', 'FAIR', false, 7500000, 'Meo Ba Tu cam', 'AVAILABLE'),
    ('Kitty', (SELECT id FROM breeds WHERE name = 'Meo Anh long ngan' LIMIT 1), 'FEMALE', '2023-04-10', 3.5, 24.0, '["kem"]', 'SHORT', 'EXCELLENT', true, 6500000, 'Meo Anh long ngan mau kem', 'RESERVED')
) AS data(name, breed_id, gender, birth_date, weight, height, colors, fur_type, health_status, vaccinated, price, description, status);

-- ============================================
-- VERIFY DATA
-- ============================================
SELECT COUNT(*) as total_breeds FROM breeds;
SELECT COUNT(*) as total_pets FROM pets;
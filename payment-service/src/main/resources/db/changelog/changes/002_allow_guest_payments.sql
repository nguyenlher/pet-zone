-- Drop NOT NULL constraint on user_id to allow guest checkout with VNPay/payments
ALTER TABLE payments ALTER COLUMN user_id DROP NOT NULL;

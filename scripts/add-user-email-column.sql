-- Add user_email column to magazine_purchases table
-- Run this in your Supabase SQL editor

ALTER TABLE magazine_purchases 
ADD COLUMN IF NOT EXISTS user_email TEXT;

-- Make user_id nullable to allow guest purchases
ALTER TABLE magazine_purchases 
ALTER COLUMN user_id DROP NOT NULL;

-- Add index for user_email
CREATE INDEX IF NOT EXISTS idx_magazine_purchases_user_email ON magazine_purchases(user_email);
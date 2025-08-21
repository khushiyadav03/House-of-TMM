-- Migration script to update magazine_purchases table for user_id
-- Run this in Supabase SQL Editor

-- Add user_id column if not exists
ALTER TABLE magazine_purchases
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Make user_email nullable (optional, can be removed later if not needed)
ALTER TABLE magazine_purchases
ALTER COLUMN user_email DROP NOT NULL;

-- Optional: Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_magazine_purchases_user_id ON magazine_purchases(user_id);

-- Note: For existing data, you may need to manually update user_id based on user_email if there are records.
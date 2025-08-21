-- Migration script to update cover_photos table with status management
-- Run this script on your existing database to add the new fields

-- Add new columns to cover_photos table
ALTER TABLE cover_photos 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('published', 'draft', 'scheduled')),
ADD COLUMN IF NOT EXISTS scheduled_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Update existing cover photos to have 'published' status if they are active
UPDATE cover_photos 
SET status = 'published' 
WHERE is_active = true AND status IS NULL;

-- Update existing cover photos to have 'draft' status if they are inactive
UPDATE cover_photos 
SET status = 'draft' 
WHERE is_active = false AND status IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cover_photos_status ON cover_photos(status);
CREATE INDEX IF NOT EXISTS idx_cover_photos_scheduled_date ON cover_photos(scheduled_date);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for cover_photos table
DROP TRIGGER IF EXISTS update_cover_photos_updated_at ON cover_photos;
CREATE TRIGGER update_cover_photos_updated_at
    BEFORE UPDATE ON cover_photos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 
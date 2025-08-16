-- Create a test magazine for payment testing
-- Run this in your Supabase SQL editor

INSERT INTO magazines (
  id,
  title,
  issue_date,
  cover_image_url,
  pdf_url,
  price,
  is_paid,
  created_at
) VALUES (
  1,
  'TMM India Test Magazine',
  '2024-01-01',
  'https://via.placeholder.com/300x400/000000/FFFFFF?text=Test+Magazine',
  'https://example.com/test-magazine.pdf',
  99.00,
  true,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  price = EXCLUDED.price,
  is_paid = EXCLUDED.is_paid,
  updated_at = NOW();

-- Verify the magazine was created
SELECT * FROM magazines WHERE id = 1;
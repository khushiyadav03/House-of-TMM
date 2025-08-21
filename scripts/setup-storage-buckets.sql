-- Setup Storage Buckets with proper policies
-- Run this in Supabase SQL Editor

-- Create storage buckets if they don't exist
-- Note: Buckets are typically created via Supabase Dashboard, but here's the SQL if needed

-- Insert bucket policies for public read access
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('images', 'images', true),
  ('magazines', 'magazines', true),
  ('cover-photos', 'cover-photos', true),
  ('brand-images', 'brand-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for public read access
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id IN ('images', 'magazines', 'cover-photos', 'brand-images'));

-- Create storage policies for authenticated uploads
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND 
  bucket_id IN ('images', 'magazines', 'cover-photos', 'brand-images')
);

-- Create storage policies for authenticated updates
CREATE POLICY "Authenticated users can update" ON storage.objects FOR UPDATE USING (
  auth.role() = 'authenticated' AND 
  bucket_id IN ('images', 'magazines', 'cover-photos', 'brand-images')
);

-- Create storage policies for authenticated deletes
CREATE POLICY "Authenticated users can delete" ON storage.objects FOR DELETE USING (
  auth.role() = 'authenticated' AND 
  bucket_id IN ('images', 'magazines', 'cover-photos', 'brand-images')
); 
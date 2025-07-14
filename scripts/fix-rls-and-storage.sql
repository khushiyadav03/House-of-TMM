-- Fix RLS (Row Level Security) issues for all tables
-- This script enables RLS and sets up appropriate policies

-- Enable RLS on all tables
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE magazines ENABLE ROW LEVEL SECURITY;
ALTER TABLE magazine_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE cover_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE youtube_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_images ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
-- Articles: Allow public read access for published articles
CREATE POLICY "Allow public read access to published articles" ON articles
    FOR SELECT USING (status = 'published');

-- Categories: Allow public read access
CREATE POLICY "Allow public read access to categories" ON categories
    FOR SELECT USING (true);

-- Article categories: Allow public read access
CREATE POLICY "Allow public read access to article categories" ON article_categories
    FOR SELECT USING (true);

-- Magazines: Allow public read access for published magazines
CREATE POLICY "Allow public read access to published magazines" ON magazines
    FOR SELECT USING (status = 'published');

-- Homepage content: Allow public read access
CREATE POLICY "Allow public read access to homepage content" ON homepage_content
    FOR SELECT USING (true);

-- Cover photos: Allow public read access for active photos
CREATE POLICY "Allow public read access to active cover photos" ON cover_photos
    FOR SELECT USING (is_active = true);

-- YouTube videos: Allow public read access for active videos
CREATE POLICY "Allow public read access to active youtube videos" ON youtube_videos
    FOR SELECT USING (is_active = true);

-- Brand images: Allow public read access for active images
CREATE POLICY "Allow public read access to active brand images" ON brand_images
    FOR SELECT USING (is_active = true);

-- Magazine purchases: Allow users to read their own purchases
CREATE POLICY "Allow users to read their own purchases" ON magazine_purchases
    FOR SELECT USING (auth.email() = user_email);

-- Create policies for authenticated write access (for admin panel)
-- Articles: Allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to manage articles" ON articles
    FOR ALL USING (auth.role() = 'authenticated');

-- Categories: Allow authenticated users to manage
CREATE POLICY "Allow authenticated users to manage categories" ON categories
    FOR ALL USING (auth.role() = 'authenticated');

-- Article categories: Allow authenticated users to manage
CREATE POLICY "Allow authenticated users to manage article categories" ON article_categories
    FOR ALL USING (auth.role() = 'authenticated');

-- Magazines: Allow authenticated users to manage
CREATE POLICY "Allow authenticated users to manage magazines" ON magazines
    FOR ALL USING (auth.role() = 'authenticated');

-- Magazine purchases: Allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert purchases" ON magazine_purchases
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Homepage content: Allow authenticated users to manage
CREATE POLICY "Allow authenticated users to manage homepage content" ON homepage_content
    FOR ALL USING (auth.role() = 'authenticated');

-- Cover photos: Allow authenticated users to manage
CREATE POLICY "Allow authenticated users to manage cover photos" ON cover_photos
    FOR ALL USING (auth.role() = 'authenticated');

-- YouTube videos: Allow authenticated users to manage
CREATE POLICY "Allow authenticated users to manage youtube videos" ON youtube_videos
    FOR ALL USING (auth.role() = 'authenticated');

-- Brand images: Allow authenticated users to manage
CREATE POLICY "Allow authenticated users to manage brand images" ON brand_images
    FOR ALL USING (auth.role() = 'authenticated');

-- Enable RLS on storage buckets (if not already enabled)
-- Note: Storage bucket policies are managed separately in Supabase dashboard
-- Make sure your storage buckets have appropriate policies for public read and authenticated write

-- Optional: Create a function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_magazines_updated_at BEFORE UPDATE ON magazines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_homepage_content_updated_at BEFORE UPDATE ON homepage_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 
-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  image_url TEXT,
  author VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  publish_date TIMESTAMP WITH TIME ZONE,
  categories TEXT[] NOT NULL DEFAULT '{}',
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create magazines table
CREATE TABLE IF NOT EXISTS magazines (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  cover_image_url TEXT NOT NULL,
  pdf_url TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  publish_date TIMESTAMP WITH TIME ZONE,
  description TEXT,
  issue_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create homepage_content table
CREATE TABLE IF NOT EXISTS homepage_content (
  id SERIAL PRIMARY KEY,
  section_name VARCHAR(100) UNIQUE NOT NULL,
  content JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pep_talk_videos table
CREATE TABLE IF NOT EXISTS pep_talk_videos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  youtube_url TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  publish_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create magazine_purchases table
CREATE TABLE IF NOT EXISTS magazine_purchases (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  magazine_id INTEGER REFERENCES magazines(id),
  payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
  payment_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alter magazines table to add is_paid
ALTER TABLE magazines ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT false;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create media table
CREATE TABLE IF NOT EXISTS media (
  id SERIAL PRIMARY KEY,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  url TEXT NOT NULL,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add SEO fields to articles
ALTER TABLE articles ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255);
ALTER TABLE articles ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS seo_keywords TEXT[];
ALTER TABLE articles ADD COLUMN IF NOT EXISTS article_type VARCHAR(50) DEFAULT 'article';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS youtube_url TEXT;

-- Add SEO fields to magazines
ALTER TABLE magazines ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255);
ALTER TABLE magazines ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE magazines ADD COLUMN IF NOT EXISTS seo_keywords TEXT[];

-- Enhance magazine_purchases for Razorpay
ALTER TABLE magazine_purchases ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(255);
ALTER TABLE magazine_purchases ADD COLUMN IF NOT EXISTS razorpay_payment_id VARCHAR(255);
ALTER TABLE magazine_purchases ADD COLUMN IF NOT EXISTS razorpay_signature VARCHAR(255);
ALTER TABLE magazine_purchases ADD COLUMN IF NOT EXISTS amount DECIMAL(10,2);
ALTER TABLE magazine_purchases ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'INR';
ALTER TABLE magazine_purchases ADD COLUMN IF NOT EXISTS refund_status VARCHAR(50);

-- Additional indexes if needed
CREATE INDEX IF NOT EXISTS idx_articles_article_type ON articles(article_type);
CREATE INDEX IF NOT EXISTS idx_articles_categories ON articles USING GIN(categories);
CREATE INDEX IF NOT EXISTS idx_articles_publish_date ON articles(publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_magazine_purchases_email ON magazine_purchases(user_email);
CREATE INDEX IF NOT EXISTS idx_pep_talk_videos_publish_date ON pep_talk_videos(publish_date DESC);

-- Insert default homepage content
INSERT INTO homepage_content (section_name, content) VALUES 
('hero_section', '{"title": "Welcome to TMM India", "subtitle": "Fashion, Lifestyle & Culture Magazine"}'),
('featured_articles', '{"count": 8, "auto_select": true}'),
('magazine_promotion', '{"show": true, "title": "Latest Issue Available"}')
ON CONFLICT (section_name) DO NOTHING;

-- Insert sample magazines
INSERT INTO magazines (title, cover_image_url, pdf_url, price, description, issue_date, is_paid) VALUES 
('TMM India December 2024', 'https://picsum.photos/350/500?random=201', '/magazines/december-2024.pdf', 299.00, 'Year-end special featuring the best of fashion, lifestyle, and culture', '2024-12-01', true),
('TMM India November 2024', 'https://picsum.photos/350/500?random=202', '/magazines/november-2024.pdf', 299.00, 'Celebrating Indian craftsmanship and contemporary design', '2024-11-01', true),
('TMM India October 2024', 'https://picsum.photos/350/500?random=203', '/magazines/october-2024.pdf', 299.00, 'Festive fashion and celebration styles for the season', '2024-10-01', true)
ON CONFLICT DO NOTHING;

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id SERIAL PRIMARY KEY,
  content_type VARCHAR(50) NOT NULL,
  content_id INTEGER NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_content ON analytics(content_type, content_id);

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  image_url TEXT,
  author VARCHAR(100) NOT NULL,
  publish_date DATE NOT NULL,
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

-- Create magazine_purchases table
CREATE TABLE IF NOT EXISTS magazine_purchases (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  magazine_id INTEGER REFERENCES magazines(id),
  payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
  payment_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_articles_categories ON articles USING GIN(categories);
CREATE INDEX IF NOT EXISTS idx_articles_publish_date ON articles(publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_magazine_purchases_email ON magazine_purchases(user_email);

-- Insert default homepage content
INSERT INTO homepage_content (section_name, content) VALUES 
('hero_section', '{"title": "Welcome to TMM India", "subtitle": "Fashion, Lifestyle & Culture Magazine"}'),
('featured_articles', '{"count": 8, "auto_select": true}'),
('magazine_promotion', '{"show": true, "title": "Latest Issue Available"}')
ON CONFLICT (section_name) DO NOTHING;

-- Insert sample magazines
INSERT INTO magazines (title, cover_image_url, pdf_url, price, description, issue_date) VALUES 
('TMM India December 2024', 'https://picsum.photos/350/500?random=201', '/magazines/december-2024.pdf', 299.00, 'Year-end special featuring the best of fashion, lifestyle, and culture', '2024-12-01'),
('TMM India November 2024', 'https://picsum.photos/350/500?random=202', '/magazines/november-2024.pdf', 299.00, 'Celebrating Indian craftsmanship and contemporary design', '2024-11-01'),
('TMM India October 2024', 'https://picsum.photos/350/500?random=203', '/magazines/october-2024.pdf', 299.00, 'Festive fashion and celebration styles for the season', '2024-10-01')
ON CONFLICT DO NOTHING;

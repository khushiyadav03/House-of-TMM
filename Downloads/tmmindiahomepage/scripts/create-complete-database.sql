-- Drop existing tables if they exist
DROP TABLE IF EXISTS article_categories CASCADE;
DROP TABLE IF EXISTS magazine_purchases CASCADE;
DROP TABLE IF EXISTS homepage_content CASCADE;
DROP TABLE IF EXISTS cover_photos CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS magazines CASCADE;
DROP TABLE IF EXISTS youtube_videos CASCADE;
DROP TABLE IF EXISTS brand_images CASCADE;

-- Create categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create articles table
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    content TEXT,
    excerpt TEXT,
    image_url TEXT,
    author VARCHAR(255),
    publish_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('published', 'draft', 'scheduled')),
    scheduled_date TIMESTAMP,
    likes INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE
);

-- Create article_categories junction table
CREATE TABLE article_categories (
    id SERIAL PRIMARY KEY,
    article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE(article_id, category_id)
);

-- Create magazines table
CREATE TABLE magazines (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    pdf_file_path TEXT,
    price DECIMAL(10,2) NOT NULL,
    issue_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('published', 'draft')),
    sales_count INTEGER DEFAULT 0
);

-- Create magazine_purchases table
CREATE TABLE magazine_purchases (
    id SERIAL PRIMARY KEY,
    magazine_id INTEGER REFERENCES magazines(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_id VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL
);

-- Create homepage_content table
CREATE TABLE homepage_content (
    id SERIAL PRIMARY KEY,
    section_name VARCHAR(100) NOT NULL UNIQUE,
    content JSONB NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create cover_photos table
CREATE TABLE cover_photos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create youtube_videos table
CREATE TABLE youtube_videos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    is_main_video BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create brand_images table
CREATE TABLE brand_images (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES
('Cover', 'cover', 'Cover stories and features'),
('Digital Cover', 'digital-cover', 'Digital cover stories'),
('Editorial Shoot', 'editorial-shoot', 'Editorial photography and shoots'),
('Brand Feature', 'brand-feature', 'Brand features and collaborations'),
('Fashion', 'fashion', 'Fashion trends and style'),
('Tech & Auto', 'tech-auto', 'Technology and automotive content'),
('Lifestyle', 'lifestyle', 'Lifestyle and living'),
('Food & Drinks', 'food-drinks', 'Food and beverage content'),
('Health & Wellness', 'health-wellness', 'Health and wellness topics'),
('Fitness & Selfcare', 'fitness-selfcare', 'Fitness and self-care'),
('Travel', 'travel', 'Travel destinations and tips'),
('Finance', 'finance', 'Financial advice and investment'),
('Sports', 'sports', 'Sports news and updates'),
('Cricket', 'cricket', 'Cricket news and analysis'),
('Golf', 'golf', 'Golf tournaments and tips'),
('Interviews', 'interviews', 'Celebrity and personality interviews'),
('Trending', 'trending', 'Trending topics and viral content'),
('Magazine', 'magazine', 'Magazine-specific content');

-- Insert default homepage content
INSERT INTO homepage_content (section_name, content) VALUES
('carousel_articles', '{"selected_articles": [], "max_articles": 8}'),
('latest_news', '{"selected_articles": [], "max_articles": 6}'),
('featured_magazine', '{"selected_magazine": null}'),
('fashion_section', '{"selected_articles": [], "max_articles": 3}'),
('tech_auto_section', '{"selected_articles": [], "max_articles": 8}'),
('sports_section', '{"selected_articles": [], "max_articles": 8}'),
('finance_section', '{"selected_articles": [], "max_articles": 4}'),
('travel_section', '{"selected_articles": [], "max_articles": 4}'),
('youtube_videos', '{"main_video": null, "recommended_videos": [], "max_recommended": 7}'),
('brand_images', '{"selected_images": [], "max_images": 10}');

-- Create indexes for better performance
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_publish_date ON articles(publish_date);
CREATE INDEX idx_articles_featured ON articles(featured);
CREATE INDEX idx_article_categories_article_id ON article_categories(article_id);
CREATE INDEX idx_article_categories_category_id ON article_categories(category_id);
CREATE INDEX idx_magazines_status ON magazines(status);
CREATE INDEX idx_magazines_issue_date ON magazines(issue_date);

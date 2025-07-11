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

-- Insert categories
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

-- Insert sample articles
INSERT INTO articles (title, slug, content, excerpt, image_url, author, publish_date, featured) VALUES
('The Future of Fashion: Trends to Watch in 2025', 'future-of-fashion-2025', 'Fashion is evolving rapidly with sustainable materials and digital innovations...', 'Explore the latest fashion trends that will dominate 2025', 'https://picsum.photos/324/500?random=1', 'Emma Watson', '2024-12-01', true),
('Exploring Sustainable Lifestyle Choices', 'sustainable-lifestyle-choices', 'Living sustainably has become more important than ever...', 'Learn how to make eco-friendly choices in your daily life', 'https://picsum.photos/324/500?random=2', 'John Green', '2024-12-02', false),
('Tech Innovations Shaping the Auto Industry', 'tech-innovations-auto-industry', 'The automotive industry is experiencing a technological revolution...', 'Discover how technology is transforming cars and transportation', 'https://picsum.photos/324/500?random=3', 'Sarah Tech', '2024-12-03', true),
('A Journey Through the World of Gourmet Cuisine', 'gourmet-cuisine-journey', 'Gourmet cooking is an art that combines tradition with innovation...', 'Explore the finest culinary experiences around the world', 'https://picsum.photos/324/500?random=4', 'Chef Marco', '2024-12-04', false),
('Top Wellness Retreats for 2025', 'top-wellness-retreats-2025', 'Wellness retreats offer the perfect escape from daily stress...', 'Find the best wellness destinations for your next retreat', 'https://picsum.photos/324/500?random=5', 'Dr. Lisa Health', '2024-12-05', true),
('Adventure Travel Destinations to Explore', 'adventure-travel-destinations', 'Adventure travel is about pushing boundaries and exploring the unknown...', 'Discover thrilling destinations for your next adventure', 'https://picsum.photos/324/500?random=6', 'Alex Adventure', '2024-12-06', false),
('Smart Investing Strategies for the Future', 'smart-investing-strategies', 'Investing wisely requires knowledge, patience, and strategic thinking...', 'Learn proven strategies for building wealth through smart investments', 'https://picsum.photos/324/500?random=7', 'Robert Finance', '2024-12-07', true),
('Emerging Athletes Redefining Sports', 'emerging-athletes-sports', 'New generation of athletes are changing the game with their unique approaches...', 'Meet the rising stars who are revolutionizing their sports', 'https://picsum.photos/324/500?random=8', 'Mike Sports', '2024-12-08', false),
('Digital Cover: The New Era of Fashion Icons', 'digital-cover-new-era-fashion', 'Digital fashion is creating new opportunities for creativity and expression...', 'How digital technology is transforming fashion photography', 'https://picsum.photos/283/400?random=9', 'Emma Watson', '2024-12-09', true),
('Top Electric Cars to Watch in 2025', 'top-electric-cars-2025', 'Electric vehicles are becoming mainstream with improved technology...', 'The most anticipated electric cars launching in 2025', 'https://picsum.photos/283/400?random=10', 'Liam Harper', '2024-12-10', false),
('Best Summer Recipes for a Healthy Diet', 'best-summer-recipes', 'Summer is the perfect time to enjoy fresh, healthy meals...', 'Delicious and nutritious recipes for the summer season', 'https://picsum.photos/283/400?random=11', 'Sophia Lee', '2024-12-11', false),
('Mindfulness Practices for Daily Wellness', 'mindfulness-wellness', 'Mindfulness can transform your daily life and improve mental health...', 'Simple mindfulness techniques for everyday wellness', 'https://picsum.photos/283/400?random=12', 'James Carter', '2024-12-12', true),
('Top 5 Home Workouts for Beginners', 'top-home-workouts', 'Working out at home has never been easier with these simple routines...', 'Effective home workout routines that require no equipment', 'https://picsum.photos/283/400?random=13', 'Rahul Sharma', '2024-12-13', false),
('Hidden Gems to Visit in Europe This Summer', 'hidden-gems-europe-summer', 'Europe offers countless hidden treasures waiting to be discovered...', 'Off-the-beaten-path destinations in Europe for summer travel', 'https://picsum.photos/283/400?random=14', 'Ava Thompson', '2024-12-14', true),
('Summer Fashion Trends You Cannot Ignore', 'summer-fashion-trends-2025', 'This summer brings exciting new trends in fashion and style...', 'The hottest fashion trends for summer 2025', 'https://picsum.photos/483/520?random=15', 'Mia Evans', '2024-12-15', true),
('How to Accessorize Like a Fashion Pro', 'accessorize-fashion-pro', 'Accessories can make or break an outfit - learn the secrets...', 'Professional tips for choosing and styling accessories', 'https://picsum.photos/300/208?random=16', 'Lucas Gray', '2024-12-16', false),
('The Rise of Sustainable Fashion Brands', 'rise-sustainable-fashion-brands', 'Sustainable fashion is no longer a trend - its the future...', 'How eco-friendly brands are changing the fashion industry', 'https://picsum.photos/300/208?random=17', 'Ella Brooks', '2024-12-17', false),
('Electric Vehicles Revolutionizing 2025', 'electric-vehicles-2025', 'The EV revolution is accelerating with new models and technology...', 'How electric vehicles are transforming transportation', 'https://picsum.photos/283/400?random=18', 'Alex Turner', '2024-12-18', true),
('AI in Automotive Industry', 'ai-automotive-industry', 'Artificial intelligence is driving the future of automotive technology...', 'The role of AI in modern car manufacturing and features', 'https://picsum.photos/283/400?random=19', 'Sam Rivera', '2024-12-19', false),
('Top Gadgets for Your Car', 'top-gadgets-car', 'Modern car gadgets can enhance safety, comfort, and entertainment...', 'Must-have tech gadgets for your vehicle in 2025', 'https://picsum.photos/283/400?random=20', 'Jordan Miles', '2024-12-20', false);

-- Insert article-category relationships
INSERT INTO article_categories (article_id, category_id) VALUES
(1, 5), (2, 7), (3, 6), (4, 8), (5, 9), (6, 11), (7, 12), (8, 13),
(9, 2), (10, 6), (11, 8), (12, 9), (13, 10), (14, 11), (15, 5),
(16, 5), (17, 5), (18, 6), (19, 6), (20, 6);

-- Insert sample magazines
INSERT INTO magazines (title, description, cover_image_url, pdf_file_path, price, issue_date) VALUES
('TMM Magazine - Winter 2024', 'Our winter edition featuring the latest in fashion, lifestyle, and technology', 'https://picsum.photos/350/500?random=67', '/magazines/winter-2024.pdf', 299.00, '2024-12-01'),
('TMM Magazine - Holiday Special', 'Special holiday edition with exclusive interviews and fashion spreads', 'https://picsum.photos/350/500?random=68', '/magazines/holiday-special.pdf', 399.00, '2024-12-15'),
('TMM Magazine - Tech & Auto 2025', 'Comprehensive guide to the latest in automotive and technology trends', 'https://picsum.photos/350/500?random=69', '/magazines/tech-auto-2025.pdf', 349.00, '2024-12-20');

-- Insert YouTube videos
INSERT INTO youtube_videos (title, video_url, thumbnail_url, is_main_video, display_order, is_active) VALUES
('TMM Fashion Week Highlights 2024', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'https://picsum.photos/780/439?random=201', true, 1, true),
('Sustainable Fashion Tips for 2025', 'https://www.youtube.com/embed/abc123', 'https://picsum.photos/110/299?random=101', false, 2, true),
('Latest Electric Car Review', 'https://www.youtube.com/embed/js123456', 'https://picsum.photos/110/300?random=102', false, 3, true),
('Healthy Summer Recipe Collection', 'https://www.youtube.com/embed/ghi789', 'https://picsum.photos/299/110?random=59', false, 4, true),
('Mindfulness Meditation Guide', 'https://www.youtube.com/embed/jkl987', 'https://picsum.photos/110/300?random=104', false, 5, true),
('Top Fitness Gear for 2025', 'https://www.youtube.com/embed/mno345', 'https://picsum.photos/110/300?random=105', false, 6, true),
('Best Travel Destination Tips', 'https://www.youtube.com/embed/pqr678', 'https://picsum.photos/110/100?random=101', false, 7, true),
('How to Budget for Luxury Cars', 'https://www.youtube.com/embed/stu901', 'https://picsum.photos/110/400?random=107', false, 8, true);

-- Insert brand images
INSERT INTO brand_images (title, image_url, display_order, is_active) VALUES
('Nike Partnership', 'https://picsum.photos/376/150?random=101', 1, true),
('Adidas Collaboration', 'https://picsum.photos/376/150?random=102', 2, true),
('BMW Luxury Cars', 'https://picsum.photos/376/150?random=103', 3, true),
('Apple Technology', 'https://picsum.photos/376/150?random=104', 4, true),
('Samsung Innovation', 'https://picsum.photos/376/150?random=105', 5, true),
('Louis Vuitton Fashion', 'https://picsum.photos/376/150?random=106', 6, true),
('Rolex Timepieces', 'https://picsum.photos/376/150?random=107', 7, true),
('Mercedes-Benz Automotive', 'https://picsum.photos/376/150?random=108', 8, true),
('Gucci Luxury Brand', 'https://picsum.photos/376/150?random=109', 9, true),
('Tesla Electric Vehicles', 'https://picsum.photos/376/150?random=110', 10, true);

-- Insert homepage content configuration
INSERT INTO homepage_content (section_name, content) VALUES
('carousel_articles', '{"selected_articles": [1, 2, 3, 4, 5, 6, 7, 8], "max_articles": 8}'),
('latest_news', '{"selected_articles": [9, 10, 11, 12, 13, 14], "max_articles": 6}'),
('featured_magazine', '{"selected_magazine": 1}'),
('fashion_section', '{"selected_articles": [15, 16, 17], "max_articles": 3}'),
('tech_auto_section', '{"selected_articles": [18, 19, 20, 3, 10], "max_articles": 8}'),
('sports_section', '{"selected_articles": [8], "max_articles": 8}'),
('finance_section', '{"selected_articles": [7], "max_articles": 4}'),
('travel_section', '{"selected_articles": [6, 14], "max_articles": 4}'),
('youtube_videos', '{"main_video": 1, "recommended_videos": [2, 3, 4, 5, 6, 7, 8], "max_recommended": 7}'),
('brand_images', '{"selected_images": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], "max_images": 10}');

-- Create indexes for better performance
CREATE INDEX idx_articles_publish_date ON articles(publish_date);
CREATE INDEX idx_articles_featured ON articles(featured);
CREATE INDEX idx_article_categories_article_id ON article_categories(article_id);
CREATE INDEX idx_article_categories_category_id ON article_categories(category_id);
CREATE INDEX idx_magazines_issue_date ON magazines(issue_date);
CREATE INDEX idx_youtube_videos_active ON youtube_videos(is_active);
CREATE INDEX idx_youtube_videos_main ON youtube_videos(is_main_video);
CREATE INDEX idx_brand_images_active ON brand_images(is_active);
CREATE INDEX idx_brand_images_order ON brand_images(display_order);

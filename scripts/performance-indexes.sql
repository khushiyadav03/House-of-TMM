-- Performance optimization indexes for TMM India database
-- Run these in your Supabase SQL editor for better query performance

-- Articles performance indexes
CREATE INDEX IF NOT EXISTS idx_articles_status_publish_date ON articles(status, publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author);

-- Magazine purchases performance indexes
CREATE INDEX IF NOT EXISTS idx_magazine_purchases_user_email ON magazine_purchases(user_email);
CREATE INDEX IF NOT EXISTS idx_magazine_purchases_payment_status ON magazine_purchases(payment_status);
CREATE INDEX IF NOT EXISTS idx_magazine_purchases_purchase_date ON magazine_purchases(purchase_date DESC);
CREATE INDEX IF NOT EXISTS idx_magazine_purchases_razorpay_order_id ON magazine_purchases(razorpay_order_id);

-- Magazine access performance indexes
CREATE INDEX IF NOT EXISTS idx_magazine_access_user_magazine ON magazine_access(user_id, magazine_id);
CREATE INDEX IF NOT EXISTS idx_magazine_access_active ON magazine_access(is_active) WHERE is_active = true;

-- Categories performance indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Article categories performance indexes
CREATE INDEX IF NOT EXISTS idx_article_categories_article_id ON article_categories(article_id);
CREATE INDEX IF NOT EXISTS idx_article_categories_category_id ON article_categories(category_id);

-- Analytics performance indexes
CREATE INDEX IF NOT EXISTS idx_analytics_content_type_id ON analytics(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at DESC);

-- YouTube videos performance indexes
CREATE INDEX IF NOT EXISTS idx_youtube_videos_active ON youtube_videos(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_youtube_videos_main ON youtube_videos(is_main_video) WHERE is_main_video = true;
CREATE INDEX IF NOT EXISTS idx_youtube_videos_display_order ON youtube_videos(display_order);

-- Brand images performance indexes
CREATE INDEX IF NOT EXISTS idx_brand_images_active ON brand_images(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_brand_images_display_order ON brand_images(display_order);

-- Cover photos performance indexes
CREATE INDEX IF NOT EXISTS idx_cover_photos_status ON cover_photos(status);
CREATE INDEX IF NOT EXISTS idx_cover_photos_active_order ON cover_photos(is_active, display_order) WHERE is_active = true;
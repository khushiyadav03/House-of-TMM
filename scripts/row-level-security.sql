-- Row Level Security (RLS) policies for TMM India platform
-- Run these in your Supabase SQL editor

-- Enable RLS on all tables
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE magazines ENABLE ROW LEVEL SECURITY;
ALTER TABLE magazine_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE magazine_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE youtube_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE cover_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Articles policies
CREATE POLICY "Articles are viewable by everyone" ON articles FOR SELECT USING (status = 'published');
CREATE POLICY "Service role can manage articles" ON articles FOR ALL USING (auth.role() = 'service_role');

-- Categories policies
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Service role can manage categories" ON categories FOR ALL USING (auth.role() = 'service_role');

-- Article categories policies
CREATE POLICY "Article categories are viewable by everyone" ON article_categories FOR SELECT USING (true);
CREATE POLICY "Service role can manage article categories" ON article_categories FOR ALL USING (auth.role() = 'service_role');

-- Magazines policies
CREATE POLICY "Published magazines are viewable by everyone" ON magazines FOR SELECT USING (status = 'published');
CREATE POLICY "Service role can manage magazines" ON magazines FOR ALL USING (auth.role() = 'service_role');

-- Magazine purchases policies
CREATE POLICY "Users can view own purchases" ON magazine_purchases FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.role() = 'service_role'
);
CREATE POLICY "Users can insert own purchases" ON magazine_purchases FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    auth.role() = 'service_role'
);
CREATE POLICY "Service role can manage all purchases" ON magazine_purchases FOR ALL USING (auth.role() = 'service_role');

-- Magazine access policies
CREATE POLICY "Users can view own access" ON magazine_access FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.role() = 'service_role'
);
CREATE POLICY "Service role can manage all access" ON magazine_access FOR ALL USING (auth.role() = 'service_role');

-- User profiles policies
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service role can manage all profiles" ON user_profiles FOR ALL USING (auth.role() = 'service_role');

-- YouTube videos policies
CREATE POLICY "Active videos are viewable by everyone" ON youtube_videos FOR SELECT USING (is_active = true);
CREATE POLICY "Service role can manage videos" ON youtube_videos FOR ALL USING (auth.role() = 'service_role');

-- Brand images policies
CREATE POLICY "Active brand images are viewable by everyone" ON brand_images FOR SELECT USING (is_active = true);
CREATE POLICY "Service role can manage brand images" ON brand_images FOR ALL USING (auth.role() = 'service_role');

-- Cover photos policies
CREATE POLICY "Published cover photos are viewable by everyone" ON cover_photos FOR SELECT USING (
    status = 'published' AND is_active = true
);
CREATE POLICY "Service role can manage cover photos" ON cover_photos FOR ALL USING (auth.role() = 'service_role');

-- Homepage content policies
CREATE POLICY "Homepage content is viewable by everyone" ON homepage_content FOR SELECT USING (true);
CREATE POLICY "Service role can manage homepage content" ON homepage_content FOR ALL USING (auth.role() = 'service_role');

-- Analytics policies
CREATE POLICY "Service role can manage analytics" ON analytics FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Users can insert own analytics" ON analytics FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    user_id IS NULL OR 
    auth.role() = 'service_role'
);
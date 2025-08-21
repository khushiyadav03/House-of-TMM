-- Database schema for TMM India magazine platform
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Magazines table
CREATE TABLE IF NOT EXISTS magazines (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    pdf_file_path TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    is_paid BOOLEAN DEFAULT true,
    sales_count INTEGER DEFAULT 0,
    issue_date DATE,
    status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft', 'scheduled')),
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT,
    alt_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Magazine purchases table
CREATE TABLE IF NOT EXISTS magazine_purchases (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Allow NULL for guest purchases
    user_email TEXT, -- Store email for guest purchases
    magazine_id INTEGER REFERENCES magazines(id) ON DELETE CASCADE,
    
    -- Payment tracking
    payment_id TEXT, -- Initially stores Razorpay order_id, later can be updated with payment_id
    razorpay_order_id TEXT, -- Razorpay order ID
    razorpay_payment_id TEXT, -- Razorpay payment ID (set after successful payment)
    
    -- Purchase details
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    
    -- Status tracking
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'cancelled')),
    refund_status TEXT CHECK (refund_status IN ('processing', 'completed', 'failed', 'partial')),
    
    -- Timestamps
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes for better performance
    -- Note: Removed unique constraint to allow guest purchases
);

-- Magazine access table (for tracking active access)
CREATE TABLE IF NOT EXISTS magazine_access (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    magazine_id INTEGER REFERENCES magazines(id) ON DELETE CASCADE,
    purchase_id INTEGER REFERENCES magazine_purchases(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    access_granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    access_expires_at TIMESTAMP WITH TIME ZONE, -- NULL for lifetime access
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, magazine_id, purchase_id)
);

-- Analytics table (optional, for tracking events)
CREATE TABLE IF NOT EXISTS analytics (
    id SERIAL PRIMARY KEY,
    content_type TEXT NOT NULL, -- 'magazine', 'article', etc.
    content_id INTEGER NOT NULL,
    event_type TEXT NOT NULL, -- 'purchase', 'view', 'download', etc.
    event_data JSONB,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_magazine_purchases_user_id ON magazine_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_magazine_purchases_magazine_id ON magazine_purchases(magazine_id);
CREATE INDEX IF NOT EXISTS idx_magazine_purchases_payment_status ON magazine_purchases(payment_status);
CREATE INDEX IF NOT EXISTS idx_magazine_purchases_razorpay_order_id ON magazine_purchases(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_magazine_purchases_razorpay_payment_id ON magazine_purchases(razorpay_payment_id);

CREATE INDEX IF NOT EXISTS idx_magazine_access_user_id ON magazine_access(user_id);
CREATE INDEX IF NOT EXISTS idx_magazine_access_magazine_id ON magazine_access(magazine_id);
CREATE INDEX IF NOT EXISTS idx_magazine_access_is_active ON magazine_access(is_active);

CREATE INDEX IF NOT EXISTS idx_analytics_content_type_id ON analytics(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_magazines_updated_at BEFORE UPDATE ON magazines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_magazine_purchases_updated_at BEFORE UPDATE ON magazine_purchases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_magazine_access_updated_at BEFORE UPDATE ON magazine_access FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE magazine_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE magazine_access ENABLE ROW LEVEL SECURITY;

-- Users can only see their own purchases
CREATE POLICY "Users can view own purchases" ON magazine_purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own purchases" ON magazine_purchases FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only see their own access records
CREATE POLICY "Users can view own access" ON magazine_access FOR SELECT USING (auth.uid() = user_id);

-- Service role can do everything (for API routes)
CREATE POLICY "Service role full access purchases" ON magazine_purchases FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access access" ON magazine_access FOR ALL USING (auth.role() = 'service_role');
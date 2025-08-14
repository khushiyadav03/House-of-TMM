-- Production Database Setup for TMM India Magazine Platform
-- Run this in your Supabase SQL editor

-- 1. Ensure the magazine_purchases table has the correct structure
CREATE TABLE IF NOT EXISTS magazine_purchases (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    magazine_id INTEGER REFERENCES magazines(id) ON DELETE CASCADE,
    
    -- Payment tracking
    payment_id TEXT, -- Initially stores Razorpay order_id
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_magazine_purchases_user_id ON magazine_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_magazine_purchases_magazine_id ON magazine_purchases(magazine_id);
CREATE INDEX IF NOT EXISTS idx_magazine_purchases_payment_status ON magazine_purchases(payment_status);
CREATE INDEX IF NOT EXISTS idx_magazine_purchases_razorpay_order_id ON magazine_purchases(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_magazine_purchases_razorpay_payment_id ON magazine_purchases(razorpay_payment_id);

-- 3. Create the increment_magazine_sales function
CREATE OR REPLACE FUNCTION increment_magazine_sales(magazine_id_param INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE magazines 
  SET sales_count = COALESCE(sales_count, 0) + 1,
      updated_at = NOW()
  WHERE id = magazine_id_param;
END;
$$ LANGUAGE plpgsql;

-- 4. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. Create trigger for updated_at
DROP TRIGGER IF EXISTS update_magazine_purchases_updated_at ON magazine_purchases;
CREATE TRIGGER update_magazine_purchases_updated_at 
    BEFORE UPDATE ON magazine_purchases 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. Enable Row Level Security
ALTER TABLE magazine_purchases ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies
DROP POLICY IF EXISTS "Users can view own purchases" ON magazine_purchases;
CREATE POLICY "Users can view own purchases" ON magazine_purchases 
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own purchases" ON magazine_purchases;
CREATE POLICY "Users can insert own purchases" ON magazine_purchases 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role full access purchases" ON magazine_purchases;
CREATE POLICY "Service role full access purchases" ON magazine_purchases 
    FOR ALL USING (auth.role() = 'service_role');

-- 8. Ensure magazines table has sales_count column
ALTER TABLE magazines ADD COLUMN IF NOT EXISTS sales_count INTEGER DEFAULT 0;

-- 9. Create function to get user's purchased magazines
CREATE OR REPLACE FUNCTION get_user_purchased_magazines(user_id_param UUID)
RETURNS TABLE(
  magazine_id INTEGER,
  title TEXT,
  cover_image_url TEXT,
  purchase_date TIMESTAMP WITH TIME ZONE,
  amount DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mp.magazine_id,
    m.title,
    m.cover_image_url,
    mp.purchase_date,
    mp.amount
  FROM magazine_purchases mp
  JOIN magazines m ON mp.magazine_id = m.id
  WHERE mp.user_id = user_id_param 
    AND mp.payment_status = 'completed'
  ORDER BY mp.purchase_date DESC;
END;
$$ LANGUAGE plpgsql;
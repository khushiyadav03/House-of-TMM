-- Create guest_orders table for temporary storage of guest checkout data
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS guest_orders (
    id SERIAL PRIMARY KEY,
    razorpay_order_id TEXT UNIQUE NOT NULL,
    magazine_id INTEGER REFERENCES magazines(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    user_phone TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_guest_orders_razorpay_order_id ON guest_orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_guest_orders_user_email ON guest_orders(user_email);
CREATE INDEX IF NOT EXISTS idx_guest_orders_status ON guest_orders(status);

-- Create updated_at trigger
CREATE TRIGGER update_guest_orders_updated_at 
    BEFORE UPDATE ON guest_orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE guest_orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for service role
CREATE POLICY "Service role full access guest orders" ON guest_orders 
    FOR ALL USING (auth.role() = 'service_role');
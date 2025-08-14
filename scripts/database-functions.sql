-- Database functions for TMM India magazine platform

-- Function to increment magazine sales count
CREATE OR REPLACE FUNCTION increment_magazine_sales(magazine_id_param INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE magazines 
  SET sales_count = COALESCE(sales_count, 0) + 1,
      updated_at = NOW()
  WHERE id = magazine_id_param;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement magazine sales count (for refunds)
CREATE OR REPLACE FUNCTION decrement_magazine_sales(magazine_id_param INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE magazines 
  SET sales_count = GREATEST(COALESCE(sales_count, 0) - 1, 0),
      updated_at = NOW()
  WHERE id = magazine_id_param;
END;
$$ LANGUAGE plpgsql;

-- Function to get user's purchased magazines
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

-- Function to check if user has purchased a magazine
CREATE OR REPLACE FUNCTION has_user_purchased_magazine(user_id_param UUID, magazine_id_param INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  purchase_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM magazine_purchases 
    WHERE user_id = user_id_param 
      AND magazine_id = magazine_id_param 
      AND payment_status = 'completed'
  ) INTO purchase_exists;
  
  RETURN purchase_exists;
END;
$$ LANGUAGE plpgsql;
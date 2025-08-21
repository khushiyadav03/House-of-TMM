-- Updated database functions for TMM India platform
-- Run these in your Supabase SQL editor

-- Function to get user's purchased magazines
CREATE OR REPLACE FUNCTION get_user_purchased_magazines(user_uuid uuid)
RETURNS TABLE (
    magazine_id integer,
    magazine_title text,
    purchase_date timestamp without time zone,
    payment_status text,
    amount numeric,
    has_access boolean
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.id as magazine_id,
        m.title as magazine_title,
        mp.purchase_date,
        mp.payment_status,
        mp.amount,
        COALESCE(ma.is_active, false) as has_access
    FROM magazine_purchases mp
    JOIN magazines m ON mp.magazine_id = m.id
    LEFT JOIN magazine_access ma ON mp.id = ma.purchase_id AND ma.user_id = user_uuid
    WHERE mp.user_id = user_uuid
    ORDER BY mp.purchase_date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has access to a magazine
CREATE OR REPLACE FUNCTION user_has_magazine_access(user_uuid uuid, mag_id integer)
RETURNS boolean AS $$
DECLARE
    has_access boolean := false;
BEGIN
    SELECT EXISTS(
        SELECT 1 
        FROM magazine_access ma
        JOIN magazine_purchases mp ON ma.purchase_id = mp.id
        WHERE ma.user_id = user_uuid 
        AND ma.magazine_id = mag_id 
        AND ma.is_active = true
        AND mp.payment_status = 'completed'
        AND (ma.expires_at IS NULL OR ma.expires_at > NOW())
    ) INTO has_access;
    
    RETURN has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get magazine sales statistics
CREATE OR REPLACE FUNCTION get_magazine_sales_stats(mag_id integer)
RETURNS TABLE (
    total_sales bigint,
    total_revenue numeric,
    completed_sales bigint,
    pending_sales bigint,
    failed_sales bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_sales,
        COALESCE(SUM(amount), 0) as total_revenue,
        COUNT(*) FILTER (WHERE payment_status = 'completed') as completed_sales,
        COUNT(*) FILTER (WHERE payment_status = 'pending') as pending_sales,
        COUNT(*) FILTER (WHERE payment_status = 'failed') as failed_sales
    FROM magazine_purchases
    WHERE magazine_id = mag_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get popular articles by views
CREATE OR REPLACE FUNCTION get_popular_articles(limit_count integer DEFAULT 10)
RETURNS TABLE (
    id integer,
    title text,
    slug text,
    author text,
    views integer,
    likes integer,
    publish_date date,
    image_url text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.title,
        a.slug,
        a.author,
        a.views,
        a.likes,
        a.publish_date,
        a.image_url
    FROM articles a
    WHERE a.status = 'published'
    ORDER BY a.views DESC, a.likes DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get articles by category
CREATE OR REPLACE FUNCTION get_articles_by_category(category_slug text, limit_count integer DEFAULT 10)
RETURNS TABLE (
    id integer,
    title text,
    slug text,
    excerpt text,
    author text,
    publish_date date,
    image_url text,
    views integer,
    likes integer
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.title,
        a.slug,
        a.excerpt,
        a.author,
        a.publish_date,
        a.image_url,
        a.views,
        a.likes
    FROM articles a
    JOIN article_categories ac ON a.id = ac.article_id
    JOIN categories c ON ac.category_id = c.id
    WHERE c.slug = category_slug 
    AND a.status = 'published'
    ORDER BY a.publish_date DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment article views
CREATE OR REPLACE FUNCTION increment_article_views(article_id integer)
RETURNS void AS $$
BEGIN
    UPDATE articles 
    SET views = COALESCE(views, 0) + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment article likes
CREATE OR REPLACE FUNCTION increment_article_likes(article_id integer)
RETURNS integer AS $$
DECLARE
    new_likes integer;
BEGIN
    UPDATE articles 
    SET likes = COALESCE(likes, 0) + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = article_id
    RETURNING likes INTO new_likes;
    
    RETURN new_likes;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get dashboard statistics
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS TABLE (
    total_articles bigint,
    published_articles bigint,
    total_magazines bigint,
    total_purchases bigint,
    total_revenue numeric,
    active_users bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM articles) as total_articles,
        (SELECT COUNT(*) FROM articles WHERE status = 'published') as published_articles,
        (SELECT COUNT(*) FROM magazines WHERE status = 'published') as total_magazines,
        (SELECT COUNT(*) FROM magazine_purchases WHERE payment_status = 'completed') as total_purchases,
        (SELECT COALESCE(SUM(amount), 0) FROM magazine_purchases WHERE payment_status = 'completed') as total_revenue,
        (SELECT COUNT(DISTINCT user_id) FROM magazine_purchases WHERE user_id IS NOT NULL) as active_users;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search articles
CREATE OR REPLACE FUNCTION search_articles(search_query text, limit_count integer DEFAULT 20)
RETURNS TABLE (
    id integer,
    title text,
    slug text,
    excerpt text,
    author text,
    publish_date date,
    image_url text,
    category_names text[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        a.id,
        a.title,
        a.slug,
        a.excerpt,
        a.author,
        a.publish_date,
        a.image_url,
        ARRAY_AGG(c.name) as category_names
    FROM articles a
    LEFT JOIN article_categories ac ON a.id = ac.article_id
    LEFT JOIN categories c ON ac.category_id = c.id
    WHERE a.status = 'published'
    AND (
        a.title ILIKE '%' || search_query || '%' OR
        a.excerpt ILIKE '%' || search_query || '%' OR
        a.content ILIKE '%' || search_query || '%' OR
        a.author ILIKE '%' || search_query || '%' OR
        c.name ILIKE '%' || search_query || '%'
    )
    GROUP BY a.id, a.title, a.slug, a.excerpt, a.author, a.publish_date, a.image_url
    ORDER BY a.publish_date DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update magazine sales count
CREATE OR REPLACE FUNCTION update_magazine_sales_count()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.payment_status = 'completed' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'completed') THEN
        UPDATE magazines 
        SET sales_count = sales_count + 1
        WHERE id = NEW.magazine_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for magazine sales count
DROP TRIGGER IF EXISTS trigger_update_magazine_sales_count ON magazine_purchases;
CREATE TRIGGER trigger_update_magazine_sales_count
    AFTER UPDATE ON magazine_purchases
    FOR EACH ROW
    EXECUTE FUNCTION update_magazine_sales_count();

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_user_purchased_magazines(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION user_has_magazine_access(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION get_popular_articles(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION get_articles_by_category(text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_article_views(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_article_likes(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION search_articles(text, integer) TO authenticated;

-- Grant execute permissions to service role (for API routes)
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;
-- Add validation constraints to articles table
ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS scheduled_date TIMESTAMP WITH TIME ZONE,
  ADD CONSTRAINT check_article_status CHECK (status IN ('draft', 'published', 'scheduled')),
  ADD CONSTRAINT check_article_title_length CHECK (LENGTH(title) >= 5 AND LENGTH(title) <= 255),
  ADD CONSTRAINT check_article_excerpt_length CHECK (LENGTH(excerpt) >= 10),
  ALTER COLUMN image_url SET NOT NULL,
  ALTER COLUMN categories SET DEFAULT '{}';

-- Add validation constraints to magazines table
ALTER TABLE magazines
  ADD COLUMN IF NOT EXISTS scheduled_date TIMESTAMP WITH TIME ZONE,
  ADD CONSTRAINT check_magazine_status CHECK (status IN ('draft', 'published', 'scheduled')),
  ADD CONSTRAINT check_magazine_title_length CHECK (LENGTH(title) >= 5 AND LENGTH(title) <= 255),
  ADD CONSTRAINT check_magazine_price CHECK (price > 0),
  ALTER COLUMN description SET NOT NULL;

-- Add validation constraints to magazine_purchases table
ALTER TABLE magazine_purchases
  ADD CONSTRAINT check_payment_status CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  ALTER COLUMN amount SET NOT NULL;

-- Create function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating updated_at timestamp
CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON articles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_magazines_updated_at
    BEFORE UPDATE ON magazines
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_homepage_content_updated_at
    BEFORE UPDATE ON homepage_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pep_talk_videos_updated_at
    BEFORE UPDATE ON pep_talk_videos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for scheduled_date
CREATE INDEX IF NOT EXISTS idx_articles_scheduled_date ON articles(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_magazines_scheduled_date ON magazines(scheduled_date);
-- Create youtube_videos table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.youtube_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    is_main_video BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create brand_images table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.brand_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add updated_at trigger for youtube_videos
DO $$ BEGIN
    CREATE TRIGGER update_youtube_videos_updated_at
    BEFORE UPDATE ON public.youtube_videos
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Add updated_at trigger for brand_images
DO $$ BEGIN
    CREATE TRIGGER update_brand_images_updated_at
    BEFORE UPDATE ON public.brand_images
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Create the update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

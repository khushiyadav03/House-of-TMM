import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET() {
  try {
    console.log('Testing all database connections...')

    // Test articles
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select(`
        *,
        categories:article_categories(
          category:categories(id, name, slug)
        )
      `)
      .limit(5)

    // Test magazines
    const { data: magazines, error: magazinesError } = await supabase
      .from('magazines')
      .select('*')
      .limit(5)

    // Test videos
    const { data: videos, error: videosError } = await supabase
      .from('youtube_videos')
      .select('*')
      .limit(5)

    // Test brand images
    const { data: brands, error: brandsError } = await supabase
      .from('brand_images')
      .select('*')
      .limit(5)

    const results = {
      articles: {
        success: !articlesError,
        count: articles?.length || 0,
        error: articlesError?.message,
        sample: articles?.[0] || null
      },
      magazines: {
        success: !magazinesError,
        count: magazines?.length || 0,
        error: magazinesError?.message,
        sample: magazines?.[0] || null
      },
      videos: {
        success: !videosError,
        count: videos?.length || 0,
        error: videosError?.message,
        sample: videos?.[0] || null
      },
      brands: {
        success: !brandsError,
        count: brands?.length || 0,
        error: brandsError?.message,
        sample: brands?.[0] || null
      }
    }

    console.log('Database test results:', results)

    return NextResponse.json(results)
  } catch (error) {
    console.error('Database test failed:', error)
    return NextResponse.json({ 
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
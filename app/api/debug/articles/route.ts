import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Use service role key for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    console.log('[Debug API] Starting debug check...')

    // Check articles table
    const { data: articles, error: articlesError, count: articlesCount } = await supabase
      .from('articles')
      .select('id, title, slug, status', { count: 'exact' })
      .limit(5)

    console.log('[Debug API] Articles query result:', { articles, articlesError, articlesCount })

    // Check categories table
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name, slug')
      .limit(10)

    console.log('[Debug API] Categories query result:', { categories, categoriesError })

    // Check article_categories table
    const { data: articleCategories, error: acError } = await supabase
      .from('article_categories')
      .select('article_id, category_id')
      .limit(10)

    console.log('[Debug API] Article categories query result:', { articleCategories, acError })

    // Check cover_photos table
    const { data: coverPhotos, error: coverPhotosError } = await supabase
      .from('cover_photos')
      .select('id, title, category, status, is_active')
      .limit(5)

    console.log('[Debug API] Cover photos query result:', { coverPhotos, coverPhotosError })

    return NextResponse.json({
      articles: {
        data: articles,
        error: articlesError,
        count: articlesCount
      },
      categories: {
        data: categories,
        error: categoriesError
      },
      articleCategories: {
        data: articleCategories,
        error: acError
      },
      coverPhotos: {
        data: coverPhotos,
        error: coverPhotosError
      }
    })

  } catch (error) {
    console.error('[Debug API] Unexpected error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error
    }, { status: 500 })
  }
}
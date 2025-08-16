import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Use service role key for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest, context: { params: { slug: string } }) {
  try {
    const { slug } = await context.params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = (page - 1) * limit

    console.log(`[Articles by Category API] Fetching articles for category: ${slug}, page: ${page}, limit: ${limit}`)

    // First, get the category ID from the slug
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id, name, slug, description')
      .eq('slug', slug)
      .single()

    if (categoryError || !categoryData) {
      console.error('[Articles by Category API] Category not found for slug:', slug, categoryError)
      
      // Let's also try to get all categories to see what's available
      const { data: allCategories } = await supabase
        .from('categories')
        .select('id, name, slug')
      
      console.log('[Articles by Category API] Available categories:', allCategories)
      
      return NextResponse.json({ 
        articles: [], 
        hasMore: false, 
        total: 0,
        error: 'Category not found',
        availableCategories: allCategories 
      }, { status: 404 })
    }

    // Get articles for this specific category only
    const { data: articlesData, error: articlesError, count } = await supabase
      .from('articles')
      .select(`
        id,
        title,
        slug,
        image_url,
        author,
        publish_date,
        excerpt,
        status,
        article_categories!inner(
          categories!inner(id, name, slug)
        )
      `, { count: 'exact' })
      .eq('article_categories.categories.id', categoryData.id)
      .eq('status', 'published')
      .order('publish_date', { ascending: false })
      .range(offset, offset + limit - 1)

    console.log(`[Articles by Category API] Found ${articlesData?.length || 0} articles for category ${categoryData.name} (ID: ${categoryData.id})`)

    if (articlesError) {
      console.error('[Articles by Category API] Articles fetch error:', articlesError)
      
      // Fallback: try to get articles without category filter if the join fails
      console.log('[Articles by Category API] Trying fallback query without category join...')
      
      const { data: fallbackArticles, error: fallbackError, count: fallbackCount } = await supabase
        .from('articles')
        .select('id, title, slug, image_url, author, publish_date, excerpt, status', { count: 'exact' })
        .eq('status', 'published')
        .order('publish_date', { ascending: false })
        .range(offset, offset + limit - 1)
      
      if (fallbackError) {
        console.error('[Articles by Category API] Fallback query also failed:', fallbackError)
        return NextResponse.json({ 
          articles: [], 
          hasMore: false, 
          total: 0,
          error: 'Failed to fetch articles' 
        }, { status: 500 })
      }
      
      // Use fallback data
      const formattedFallbackArticles = (fallbackArticles || []).map((article: any) => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        image_url: article.image_url,
        author: article.author,
        publish_date: article.publish_date,
        excerpt: article.excerpt,
        categories: [{ id: categoryData.id, name: categoryData.name, slug: categoryData.slug }]
      }))

      const fallbackTotal = fallbackCount || 0
      const fallbackHasMore = offset + limit < fallbackTotal

      console.log(`[Articles by Category API] Fallback found ${formattedFallbackArticles.length} articles, total: ${fallbackTotal}`)

      return NextResponse.json({
        articles: formattedFallbackArticles,
        hasMore: fallbackHasMore,
        total: fallbackTotal,
        category: categoryData,
        note: 'Using fallback query - category filtering may not be accurate'
      })
    }

    // Format the articles data
    const formattedArticles = (articlesData || []).map((article: any) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      image_url: article.image_url,
      author: article.author,
      publish_date: article.publish_date,
      excerpt: article.excerpt,
      categories: article.article_categories?.map((ac: any) => ac.categories) || [categoryData]
    }))

    const total = count || 0
    const hasMore = offset + limit < total

    console.log(`[Articles by Category API] Found ${formattedArticles.length} articles, total: ${total}, hasMore: ${hasMore}`)

    return NextResponse.json({
      articles: formattedArticles,
      hasMore,
      total,
      category: categoryData
    })

  } catch (error) {
    console.error('[Articles by Category API] Unexpected error:', error)
    return NextResponse.json({ 
      articles: [], 
      hasMore: false, 
      total: 0,
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
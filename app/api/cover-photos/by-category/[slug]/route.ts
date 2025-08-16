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

    console.log(`[Cover Photos by Category API] Fetching cover photos for category: ${slug}, page: ${page}, limit: ${limit}`)

    // Map slug to category filter
    let categoryFilter = slug // Use the slug directly since we updated the database

    // Get cover photos for this category with pagination (newest first)
    const { data: coverPhotosData, error: coverPhotosError, count } = await supabase
      .from('cover_photos')
      .select('*', { count: 'exact' })
      .eq('category', categoryFilter)
      .eq('status', 'published')
      .eq('is_active', true)
      .order('created_at', { ascending: false }) // Newest first
      .order('display_order', { ascending: true }) // Then by display order
      .range(offset, offset + limit - 1)

    console.log(`[Cover Photos by Category API] Query result: found ${coverPhotosData?.length || 0} photos for category '${categoryFilter}', error: ${coverPhotosError?.message || 'none'}`)

    if (coverPhotosError) {
      console.error('[Cover Photos by Category API] Cover photos fetch error:', coverPhotosError)
      return NextResponse.json({ 
        articles: [], 
        hasMore: false, 
        total: 0,
        error: 'Failed to fetch cover photos' 
      }, { status: 500 })
    }

    // Format the cover photos data to match article structure
    const formattedArticles = (coverPhotosData || []).map((photo: any) => ({
      id: photo.id,
      title: photo.title,
      slug: `cover-photo-${photo.id}`, // Generate a slug for cover photos
      image_url: photo.image_url,
      author: 'TMM India', // Default author for cover photos
      publish_date: photo.created_at,
      excerpt: photo.description || '',
      categories: [{ id: 0, name: categoryFilter, slug: slug }]
    }))

    const total = count || 0
    const hasMore = offset + limit < total

    console.log(`[Cover Photos by Category API] Found ${formattedArticles.length} cover photos, total: ${total}, hasMore: ${hasMore}`)

    return NextResponse.json({
      articles: formattedArticles,
      hasMore,
      total,
      category: { id: 0, name: categoryFilter, slug: slug, description: `${categoryFilter} photos and features` }
    })

  } catch (error) {
    console.error('[Cover Photos by Category API] Unexpected error:', error)
    return NextResponse.json({ 
      articles: [], 
      hasMore: false, 
      total: 0,
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
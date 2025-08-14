import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Get total articles count
    const { count: totalArticles } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })

    // Get published articles count
    const { count: published } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')

    // Get draft articles count
    const { count: draft } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'draft')

    // Get total views and likes
    const { data: viewsData } = await supabase
      .from('articles')
      .select('views, likes')

    const totalViews = viewsData?.reduce((sum, article) => sum + (article.views || 0), 0) || 0
    const totalLikes = viewsData?.reduce((sum, article) => sum + (article.likes || 0), 0) || 0

    return NextResponse.json({
      totalArticles: totalArticles || 0,
      published: published || 0,
      draft: draft || 0,
      totalViews,
      totalLikes,
    })
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
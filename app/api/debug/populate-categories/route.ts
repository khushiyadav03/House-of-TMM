import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Use service role key for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    console.log('[Populate Categories API] Starting to populate article categories...')

    // Get all articles without category relationships
    const { data: articles } = await supabase
      .from('articles')
      .select('id, title, slug')
      .eq('status', 'published')

    // Get all categories
    const { data: categories } = await supabase
      .from('categories')
      .select('id, name, slug')

    if (!articles || !categories) {
      return NextResponse.json({ error: 'Failed to fetch articles or categories' }, { status: 500 })
    }

    console.log(`[Populate Categories API] Found ${articles.length} articles and ${categories.length} categories`)

    // Simple mapping based on article titles/slugs to categories
    const categoryMappings = []
    
    for (const article of articles) {
      let categoryId = null
      const title = article.title.toLowerCase()
      const slug = article.slug.toLowerCase()
      
      // Simple keyword matching
      if (title.includes('fashion') || slug.includes('fashion')) {
        categoryId = categories.find(c => c.slug === 'fashion')?.id
      } else if (title.includes('digital cover') || slug.includes('digital-cover')) {
        categoryId = categories.find(c => c.slug === 'digital-cover')?.id
      } else if (title.includes('editorial') || slug.includes('editorial')) {
        categoryId = categories.find(c => c.slug === 'editorial-shoot')?.id
      } else if (title.includes('wellness') || title.includes('health') || slug.includes('wellness')) {
        categoryId = categories.find(c => c.slug === 'health-wellness')?.id
      } else if (title.includes('travel') || slug.includes('travel')) {
        categoryId = categories.find(c => c.slug === 'travel')?.id
      } else if (title.includes('sport') || slug.includes('sport')) {
        categoryId = categories.find(c => c.slug === 'sports')?.id
      } else if (title.includes('finance') || title.includes('stock') || title.includes('investment')) {
        categoryId = categories.find(c => c.slug === 'finance')?.id
      } else {
        // Default to lifestyle for unmatched articles
        categoryId = categories.find(c => c.slug === 'lifestyle')?.id
      }
      
      if (categoryId) {
        categoryMappings.push({
          article_id: article.id,
          category_id: categoryId
        })
      }
    }

    console.log(`[Populate Categories API] Created ${categoryMappings.length} category mappings`)

    // Insert the mappings (ignore duplicates)
    if (categoryMappings.length > 0) {
      const { data, error } = await supabase
        .from('article_categories')
        .upsert(categoryMappings, { onConflict: 'article_id,category_id' })

      if (error) {
        console.error('[Populate Categories API] Error inserting mappings:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      console.log('[Populate Categories API] Successfully inserted category mappings')
    }

    return NextResponse.json({
      success: true,
      articlesProcessed: articles.length,
      categoriesFound: categories.length,
      mappingsCreated: categoryMappings.length,
      mappings: categoryMappings
    })

  } catch (error) {
    console.error('[Populate Categories API] Unexpected error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error
    }, { status: 500 })
  }
}
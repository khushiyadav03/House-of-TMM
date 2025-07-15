import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Use the service role key to bypass RLS for this server-side route
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest, context: { params: { slug: string } }) {
  const { slug } = await context.params
  try {
    // Check if the parameter is numeric (ID) or string (slug)
    const isNumeric = /^\d+$/.test(slug)
    let column = isNumeric ? "id" : "slug"
    let value = isNumeric ? Number.parseInt(slug, 10) : slug

    // Clean the slug for robust matching
    let cleanSlug = typeof value === 'string' ? value.trim().toLowerCase() : value
    if (column === 'slug') {
      console.log("[Article API] Cleaned slug:", cleanSlug)
    }

    // Add logging for debugging
    console.log("[Article API] Fetching article:", { slug, column, value })

    let query = supabase
      .from("articles")
      .select(`*, article_categories(categories(*))`)

    if (column === "slug") {
      query = query.eq("slug", cleanSlug)
    } else {
      query = query.eq("id", value)
    }

    let { data, error } = await query

    // Defensive: if multiple articles found, use the first; if none, return 404
    if (Array.isArray(data)) {
      if (data.length === 0) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 })
      }
      data = data[0]
    } else if (!data) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }
    // At this point, data is a single article object
    const article = data as any

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    // Increment view count if article and article.id exist
    if (article && article.id) {
      await supabase
        .from("articles")
        .update({ views: (article.views || 0) + 1 })
        .eq("id", article.id)
    }

    // Get related articles (same subcategory)
    let relatedArticles: any[] = []
    const firstCategoryId = article && article.article_categories?.[0]?.categories?.id
    if (firstCategoryId) {
      const { data: relData } = await supabase
        .from("article_categories")
        .select(`article_id, articles!inner(id, title, slug, image_url, author, publish_date)`)
        .eq("category_id", firstCategoryId)
        .neq("article_id", article.id)
        .order("articles.publish_date", { ascending: false })
        .limit(3)
      relatedArticles = (relData || []).map((rel: any) => rel.articles)
    }

    return NextResponse.json({
      article: article,
      relatedArticles: relatedArticles || [],
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: { params: { slug: string } }) {
  const { slug } = await context.params
  try {
    // Check if the parameter is numeric (ID) or string (slug)
    const isNumeric = /^\d+$/.test(slug)
    const column = isNumeric ? "id" : "slug"
    const value = isNumeric ? Number.parseInt(slug, 10) : slug

    const body = await request.json()
    const { title, content, excerpt, image_url, author, publish_date, scheduled_date, featured, categories } = body

    // Generate slug from title if not provided
    const newSlug =
      body.slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

    const { data, error } = await supabase
      .from("articles")
      .update({
        title,
        slug: newSlug,
        content,
        excerpt,
        image_url,
        author,
        publish_date,
        scheduled_date,
        featured,
        updated_at: new Date().toISOString(),
      })
      .eq(column, value)
      .select()
      .single()

    if (error) {
      console.error("[Article Update Error]", error)
      return NextResponse.json({ error: error.message, details: error }, { status: 500 })
    }

    let categoryIds = categories
    // Defensive: if categories is not an array, but article_categories is present, extract IDs
    if ((!Array.isArray(categories) || !categories.length) && Array.isArray(body.article_categories)) {
      categoryIds = body.article_categories
        .map((ac: any) => ac.categories?.id)
        .filter((id: any) => !!id)
    }

    // Handle categories if provided
    if (categoryIds && Array.isArray(categoryIds)) {
      // Delete existing category associations
      await supabase.from("article_categories").delete().eq("article_id", data.id)

      // Insert new category associations
      if (categoryIds.length > 0) {
        const categoryAssociations = categoryIds.map((categoryId) => ({
          article_id: data.id,
          category_id: categoryId,
        }))

        await supabase.from("article_categories").insert(categoryAssociations)
      }
    }

    return NextResponse.json({ success: true, article: data })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: { params: { slug: string } }) {
  const { slug } = await context.params
  try {
    // Check if the parameter is numeric (ID) or string (slug)
    const isNumeric = /^\d+$/.test(slug)
    const column = isNumeric ? "id" : "slug"
    const value = isNumeric ? Number.parseInt(slug, 10) : slug

    const { error } = await supabase.from("articles").delete().eq(column, value)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

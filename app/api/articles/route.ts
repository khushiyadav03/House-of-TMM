import { NextResponse, type NextRequest } from "next/server"
import { getSupabaseServer } from "@/lib/supabase" // Import the function

/**
 * GET /api/articles
 * Fetches articles with optional filtering, pagination, and sorting.
 * Query parameters:
 * - limit: number of articles to return (default: 10)
 * - offset: number of articles to skip (default: 0)
 * - category: filter by category slug
 * - search: search by title or excerpt
 * - sort: 'created_at_desc' (default) or 'publish_date_desc'
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServer() // Get the server-side Supabase client
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const categorySlug = searchParams.get("category")
    const searchTerm = searchParams.get("search")
    const sort = searchParams.get("sort") || "created_at_desc"

    let query = supabase
      .from("articles")
      .select(
        `
        *,
        article_categories(
          categories(name, slug)
        )
      `,
        { count: "exact" },
      )
      .eq("status", "published")

    if (categorySlug) {
      query = query.eq("article_categories.categories.slug", categorySlug)
    }

    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`)
    }

    if (sort === "created_at_desc") {
      query = query.order("created_at", { ascending: false })
    } else if (sort === "publish_date_desc") {
      query = query.order("publish_date", { ascending: false })
    } else {
      query = query.order("created_at", { ascending: false }) // Default sort
    }

    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      if ((error as any).code === "42P01") {
        console.warn("articles table not found → returning []")
        return NextResponse.json({ articles: [], total: 0 })
      }
      console.error("Articles fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch articles", details: error.message }, { status: 500 })
    }

    // Flatten categories for easier consumption
    const articles = data?.map((article) => ({
      ...article,
      category: article.article_categories?.[0]?.categories?.name || "Uncategorized",
      slug: article.slug, // Ensure slug is always present
    }))

    return NextResponse.json({ articles: articles ?? [], total: count ?? 0 })
  } catch (err) {
    console.error("GET /api/articles crashed:", err)
    return NextResponse.json(
      { error: "Internal server error", details: (err as Error).message || "Unknown error" },
      { status: 500 },
    )
  }
}

/**
 * POST /api/articles
 * Creates a new article.
 * Accepts: { title, slug, content, excerpt, image_url, author, publish_date, status, featured, category_ids }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServer() // Get the server-side Supabase client
    const body = await request.json()
    const { title, slug, content, excerpt, image_url, author, publish_date, status, featured, category_ids } = body

    const { data: articleData, error: articleError } = await supabase
      .from("articles")
      .insert({
        title,
        slug,
        content,
        excerpt,
        image_url,
        author,
        publish_date,
        status,
        featured: Boolean(featured),
        likes: 0,
        views: 0,
      })
      .select()
      .single()

    if (articleError) {
      if ((articleError as any).code === "23505") {
        return NextResponse.json({ error: "Article with this slug already exists" }, { status: 409 })
      }
      console.error("Article insert error:", articleError)
      return NextResponse.json({ error: "Failed to create article", details: articleError.message }, { status: 500 })
    }

    // Link categories
    if (category_ids && category_ids.length > 0) {
      const articleCategories = category_ids.map((categoryId: number) => ({
        article_id: articleData.id,
        category_id: categoryId,
      }))
      const { error: linkError } = await supabase.from("article_categories").insert(articleCategories)

      if (linkError) {
        console.error("Article category link error:", linkError)
        // Optionally, roll back the article creation or handle this gracefully
        return NextResponse.json(
          { error: "Failed to link categories to article", details: linkError.message },
          { status: 500 },
        )
      }
    }

    return NextResponse.json({ success: true, article: articleData })
  } catch (err) {
    console.error("POST /api/articles crashed:", err)
    return NextResponse.json(
      { error: "Internal server error", details: (err as Error).message || "Unknown error" },
      { status: 500 },
    )
  }
}

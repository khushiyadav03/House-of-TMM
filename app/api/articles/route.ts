import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category")
    const status = searchParams.get("status") // only add a filter when it’s provided
    const featured = searchParams.get("featured")
    const sort = searchParams.get("sort") || "created_at_desc" // Default sort by latest

    const supabase = getSupabaseServer()

    let query = supabase.from("articles").select(
      `
      *,
      article_categories(
        categories(*)
      )
    `,
      { count: "exact" },
    )

    // Apply sorting
    if (sort === "created_at_desc") {
      query = query.order("created_at", { ascending: false })
    } else if (sort === "publish_date_desc") {
      query = query.order("publish_date", { ascending: false })
    }
    // Add more sorting options as needed

    // Apply status filter only when explicitly supplied
    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    if (category) {
      query = query.eq("article_categories.categories.slug", category)
    }

    if (featured === "true") {
      query = query.eq("featured", true)
    }

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit - 1

    query = query.range(startIndex, endIndex)

    const { data, error, count } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
    }

    // Transform data to include category names
    const transformedData =
      data?.map((article) => ({
        ...article,
        category: article.article_categories?.[0]?.categories?.name || "Uncategorized",
      })) || []

    return NextResponse.json({
      articles: transformedData,
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      slug,
      content,
      excerpt,
      image_url,
      author,
      publish_date,
      status = "draft",
      scheduled_date,
      featured = false,
      category_ids = [],
    } = body

    const supabase = getSupabaseServer()

    // Validate required fields
    if (!title || !slug || !publish_date) {
      return NextResponse.json({ error: "Missing required fields: title, slug, publish_date" }, { status: 400 })
    }

    // Check if slug already exists
    const { data: existingArticle } = await supabase.from("articles").select("id").eq("slug", slug).single()

    if (existingArticle) {
      return NextResponse.json({ error: "Article with this slug already exists" }, { status: 400 })
    }

    // Insert article
    const { data: article, error: articleError } = await supabase
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
        scheduled_date,
        featured,
      })
      .select()
      .single()

    if (articleError) {
      console.error("Article insert error:", articleError)
      return NextResponse.json({ error: "Failed to create article" }, { status: 500 })
    }

    // Insert category relationships
    if (category_ids.length > 0) {
      const categoryRelations = category_ids.map((categoryId: number) => ({
        article_id: article.id,
        category_id: categoryId,
      }))

      const { error: categoryError } = await supabase.from("article_categories").insert(categoryRelations)

      if (categoryError) {
        console.error("Category relation error:", categoryError)
        // Don't fail the request, just log the error
      }
    }

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

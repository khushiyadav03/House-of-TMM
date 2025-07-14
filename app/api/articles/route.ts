import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Regular client for read operations
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Admin client with service role for write operations (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category")
    const subcategory = searchParams.get("subcategory") // NEW: subcategory filter
    const status = searchParams.get("status")
    const featured = searchParams.get("featured")

    const offset = (page - 1) * limit

    // Build the query
    let query = supabase
      .from("articles")
      .select(`*, article_categories:article_categories(*, categories:categories(*))`, { count: "exact" })
      .order("created_at", { ascending: false })

    // If filtering by subcategory (slug), join and filter
    if (subcategory) {
      // Get category id for the slug
      const { data: catData, error: catError } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", subcategory)
        .single()
      if (catError || !catData) {
        return NextResponse.json({ articles: [], total: 0, page, totalPages: 0 })
      }
      query = query.contains('article_categories', [{ category_id: catData.id }])
    }

    // Optionally filter by status or featured
    if (status) query = query.eq("status", status)
    if (featured) query = query.eq("featured", featured === "true")

    // Pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
    }

    // Transform data to include all categories
    const transformedData =
      data?.map((article) => ({
        ...article,
        categories: (article.article_categories || []).map((ac: any) => ac.categories),
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
      featured = false,
      categories = [],
    } = body

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
    const { data: article, error: articleError } = await supabaseAdmin
      .from("articles")
      .insert({
        title,
        slug,
        content,
        excerpt,
        image_url,
        author,
        publish_date,
        featured,
      })
      .select()
      .single()

    if (articleError) {
      console.error("Article insert error:", articleError)
      return NextResponse.json({ error: "Failed to create article" }, { status: 500 })
    }

    // Insert category relationships
    if (categories.length > 0) {
      const categoryRelations = categories.map((categoryId: number) => ({
        article_id: article.id,
        category_id: categoryId,
      }))

      const { error: categoryError } = await supabaseAdmin.from("article_categories").insert(categoryRelations)

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

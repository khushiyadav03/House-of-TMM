import { type NextRequest, NextResponse } from "next/server"
import { createServerComponentClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const search = searchParams.get("search")
    const sort = searchParams.get("sort") || "created_at_desc"

    const supabase = createServerComponentClient()

    let query = supabase.from("articles").select(`
        *,
        categories!inner(*)
      `)

    // Filter by category if provided
    if (category) {
      query = query.eq("categories.slug", category)
    }

    // Search functionality
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,author.ilike.%${search}%`)
    }

    // Sorting
    if (sort === "created_at_desc") {
      query = query.order("created_at", { ascending: false })
    } else if (sort === "publish_date_desc") {
      query = query.order("publish_date", { ascending: false })
    }

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: articles, error, count } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
    }

    return NextResponse.json({
      articles: articles || [],
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, excerpt, image_url, author, categories, featured = false } = body

    if (!title || !content || !author) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServerComponentClient()

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

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
        featured,
        publish_date: new Date().toISOString().split("T")[0],
      })
      .select()
      .single()

    if (articleError) {
      console.error("Article insert error:", articleError)
      return NextResponse.json({ error: "Failed to create article" }, { status: 500 })
    }

    // Link categories if provided
    if (categories && categories.length > 0) {
      const categoryLinks = categories.map((categoryId: number) => ({
        article_id: article.id,
        category_id: categoryId,
      }))

      const { error: categoryError } = await supabase.from("article_categories").insert(categoryLinks)

      if (categoryError) {
        console.error("Category link error:", categoryError)
      }
    }

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

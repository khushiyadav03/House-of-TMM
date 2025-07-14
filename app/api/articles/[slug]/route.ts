import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest, context: { params: { slug: string } }) {
  const { slug } = await context.params
  try {
    // Check if the parameter is numeric (ID) or string (slug)
    const isNumeric = /^\d+$/.test(slug)
    const column = isNumeric ? "id" : "slug"
    const value = isNumeric ? Number.parseInt(slug, 10) : slug

    const { data, error } = await supabase
      .from("articles")
      .select(`
        *,
        article_categories(
          categories(*)
        )
      `)
      .eq(column, value)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    // Increment view count
    await supabase
      .from("articles")
      .update({ views: (data.views || 0) + 1 })
      .eq("id", data.id)

    // Get related articles (same subcategory)
    let relatedArticles: any[] = []
    const firstCategoryId = data.article_categories?.[0]?.categories?.id
    if (firstCategoryId) {
      const { data: relData } = await supabase
        .from("article_categories")
        .select(`article_id, articles!inner(id, title, slug, image_url, author, publish_date)`)
        .eq("category_id", firstCategoryId)
        .neq("article_id", data.id)
        .order("articles.publish_date", { ascending: false })
        .limit(3)
      relatedArticles = (relData || []).map((rel: any) => rel.articles)
    }

    return NextResponse.json({
      article: data,
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
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Handle categories if provided
    if (categories && Array.isArray(categories)) {
      // Delete existing category associations
      await supabase.from("article_categories").delete().eq("article_id", data.id)

      // Insert new category associations
      if (categories.length > 0) {
        const categoryAssociations = categories.map((categoryId) => ({
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

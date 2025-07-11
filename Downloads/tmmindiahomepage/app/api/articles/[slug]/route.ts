import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    // Check if the parameter is numeric (ID) or string (slug)
    const isNumeric = /^\d+$/.test(params.slug)
    const column = isNumeric ? "id" : "slug"
    const value = isNumeric ? Number.parseInt(params.slug, 10) : params.slug

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

    // Get related articles
    const { data: relatedArticles } = await supabase
      .from("articles")
      .select("id, title, slug, image_url, author, publish_date")
      .neq("id", data.id)
      .limit(3)
      .order("publish_date", { ascending: false })

    return NextResponse.json({
      article: data,
      relatedArticles: relatedArticles || [],
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    // Check if the parameter is numeric (ID) or string (slug)
    const isNumeric = /^\d+$/.test(params.slug)
    const column = isNumeric ? "id" : "slug"
    const value = isNumeric ? Number.parseInt(params.slug, 10) : params.slug

    const body = await request.json()
    const { title, content, excerpt, image_url, author, publish_date, scheduled_date, featured, categories } = body

    // Generate slug from title if not provided
    const slug =
      body.slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

    const { data, error } = await supabase
      .from("articles")
      .update({
        title,
        slug,
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

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    // Check if the parameter is numeric (ID) or string (slug)
    const isNumeric = /^\d+$/.test(params.slug)
    const column = isNumeric ? "id" : "slug"
    const value = isNumeric ? Number.parseInt(params.slug, 10) : params.slug

    const { error } = await supabase.from("articles").delete().eq(column, value)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

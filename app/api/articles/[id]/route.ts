import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select(`
        *,
        article_categories(
          categories(id, name, slug)
        )
      `)
      .eq("id", params.id)
      .single()

    if (error) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    const article = {
      ...data,
      categories: data.article_categories?.map((ac: any) => ac.categories).filter(Boolean) || [],
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
      categories,
      status,
      scheduled_date,
      featured,
    } = body

    // Update article
    const { error: articleError } = await supabase
      .from("articles")
      .update({
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
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)

    if (articleError) {
      console.error("Article update error:", articleError)
      return NextResponse.json({ error: "Failed to update article" }, { status: 500 })
    }

    // Update categories
    if (categories) {
      // Delete existing categories
      await supabase.from("article_categories").delete().eq("article_id", params.id)

      // Insert new categories
      if (categories.length > 0) {
        const categoryInserts = categories.map((categoryId: number) => ({
          article_id: Number.parseInt(params.id),
          category_id: categoryId,
        }))

        await supabase.from("article_categories").insert(categoryInserts)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const { error } = await supabase
      .from("articles")
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)

    if (error) {
      console.error("Article patch error:", error)
      return NextResponse.json({ error: "Failed to update article" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabase.from("articles").delete().eq("id", params.id)

    if (error) {
      console.error("Article delete error:", error)
      return NextResponse.json({ error: "Failed to delete article" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

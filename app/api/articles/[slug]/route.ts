import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { identifier: string } }) {
  try {
    // helper
    const isNumeric = (value: string) => /^\d+$/.test(value)
    const column = isNumeric(params.identifier) ? "id" : "slug"
    const matchValue = isNumeric(params.identifier) ? Number.parseInt(params.identifier, 10) : params.identifier

    const { data, error } = await supabase
      .from("articles")
      .select(`
        *,
        article_categories(
          categories(id, name, slug)
        )
      `)
      .eq(column, matchValue)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    await supabase
      .from("articles")
      .update({ views: (data.views || 0) + 1 })
      .eq("id", data.id)

    // Get related articles
    const { data: relatedArticles } = await supabase
      .from("articles")
      .select("id, title, slug, image_url, author, publish_date")
      .neq("id", data.id)
      .eq("status", "published")
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

export async function PUT(request: NextRequest, { params }: { params: { identifier: string } }) {
  try {
    // helper
    const isNumeric = (value: string) => /^\d+$/.test(value)
    const column = isNumeric(params.identifier) ? "id" : "slug"
    const matchValue = isNumeric(params.identifier) ? Number.parseInt(params.identifier, 10) : params.identifier

    const body = await request.json()
    const { title, content, excerpt, image_url, author, publish_date, status, scheduled_date, featured } = body

    const { data, error } = await supabase
      .from("articles")
      .update({
        title,
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
      .eq(column, matchValue)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, article: data })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { identifier: string } }) {
  try {
    // helper
    const isNumeric = (value: string) => /^\d+$/.test(value)
    const column = isNumeric(params.identifier) ? "id" : "slug"
    const matchValue = isNumeric(params.identifier) ? Number.parseInt(params.identifier, 10) : params.identifier

    const { error } = await supabase.from("articles").delete().eq(column, matchValue)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

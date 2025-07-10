import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    // Get current article
    const { data: article, error: fetchError } = await supabase
      .from("articles")
      .select("id, likes")
      .eq("slug", params.slug)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 404 })
    }

    // Increment likes
    const { data, error } = await supabase
      .from("articles")
      .update({ likes: (article.likes || 0) + 1 })
      .eq("id", article.id)
      .select("likes")
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, likes: data.likes })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

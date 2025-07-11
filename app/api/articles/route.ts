import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const sort = searchParams.get("sort")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12") // Default to 12 articles per page

    const supabase = getSupabaseServer()

    let query = supabase.from("articles").select("*")

    if (category) {
      query = query.eq("category", category)
    }

    if (sort === "created_at_desc") {
      query = query.order("created_at", { ascending: false })
    } else {
      query = query.order("created_at", { ascending: false }) // Default sort
    }

    // Implement pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit - 1
    query = query.range(startIndex, endIndex)

    const { data, error } = await query

    if (error) {
      console.error("Supabase fetch error (articles):", error)
      return NextResponse.json({ error: "Failed to fetch articles", details: error.message }, { status: 500 })
    }

    return NextResponse.json({ articles: data || [] }, { status: 200 })
  } catch (error: any) {
    console.error("GET /api/articles crashed:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error.message || "Unknown error" },
      { status: 500 },
    )
  }
}

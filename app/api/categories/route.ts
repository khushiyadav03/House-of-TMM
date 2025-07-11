import { NextResponse, type NextRequest } from "next/server"
import { getSupabaseServer } from "@/lib/supabase"

/**
 * GET /api/categories
 * Fetches all categories.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServer()
    const { data: categories, error } = await supabase.from("categories").select("*").order("name", { ascending: true })

    if (error) {
      if ((error as any).code === "42P01") {
        console.warn("categories table not found → returning []")
        return NextResponse.json({ categories: [] })
      }
      console.error("Categories fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch categories", details: error.message }, { status: 500 })
    }

    return NextResponse.json({ categories: categories ?? [] })
  } catch (err) {
    console.error("GET /api/categories crashed:", err)
    return NextResponse.json(
      { error: "Internal server error", details: (err as Error).message || "Unknown error" },
      { status: 500 },
    )
  }
}

/**
 * POST /api/categories
 * Creates a new category.
 * Accepts: { name, slug, description }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServer()
    const body = await request.json()
    const { name, slug, description } = body

    const { data, error } = await supabase.from("categories").insert({ name, slug, description }).select().single()

    if (error) {
      if ((error as any).code === "23505") {
        return NextResponse.json({ error: "Category with this slug already exists" }, { status: 409 })
      }
      console.error("Category insert error:", error)
      return NextResponse.json({ error: "Failed to create category", details: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, category: data })
  } catch (err) {
    console.error("POST /api/categories crashed:", err)
    return NextResponse.json(
      { error: "Internal server error", details: (err as Error).message || "Unknown error" },
      { status: 500 },
    )
  }
}

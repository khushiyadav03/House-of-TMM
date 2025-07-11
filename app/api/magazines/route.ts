import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase"

/**
 * GET /api/magazines
 * Returns every magazine ordered by issue_date (newest first).
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "12")
  const sort = searchParams.get("sort") || "created_at_desc" // Default sort by latest

  const supabase = getSupabaseServer()

  let query = supabase.from("magazines").select("*", { count: "exact" })

  // Apply sorting
  if (sort === "created_at_desc") {
    query = query.order("created_at", { ascending: false })
  } else if (sort === "issue_date_desc") {
    query = query.order("issue_date", { ascending: false })
  }
  // Add more sorting options as needed

  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit - 1

  query = query.range(startIndex, endIndex)

  try {
    const { data: magazines, error, count } = await query

    if (error) {
      console.error("Magazines fetch error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ magazines, total: count, totalPages: Math.ceil((count || 0) / limit) })
  } catch (error: any) {
    console.error("Magazines fetch error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

/**
 * POST /api/magazines
 * Creates a new magazine.  Required fields: title, price, issue_date.
 */
export async function POST(request: NextRequest) {
  const supabase = getSupabaseServer()
  try {
    const newMagazine = await request.json()
    const { data, error } = await supabase.from("magazines").insert(newMagazine).select().single()

    if (error) {
      console.error("Error creating magazine:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error("Error creating magazine:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

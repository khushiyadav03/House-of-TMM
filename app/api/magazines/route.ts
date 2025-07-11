import { type NextRequest, NextResponse } from "next/server"
import { createServerComponentClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sort = searchParams.get("sort") || "created_at_desc"

    const supabase = createServerComponentClient()

    let query = supabase.from("magazines").select("*")

    // Sorting
    if (sort === "created_at_desc") {
      query = query.order("created_at", { ascending: false })
    } else if (sort === "issue_date_desc") {
      query = query.order("issue_date", { ascending: false })
    }

    const { data: magazines, error } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch magazines" }, { status: 500 })
    }

    return NextResponse.json(magazines || [])
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, cover_image_url, pdf_file_path, price, issue_date } = body

    if (!title || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServerComponentClient()

    const { data: magazine, error } = await supabase
      .from("magazines")
      .insert({
        title,
        description,
        cover_image_url,
        pdf_file_path,
        price,
        issue_date: issue_date || new Date().toISOString().split("T")[0],
        status: "published",
      })
      .select()
      .single()

    if (error) {
      console.error("Magazine insert error:", error)
      return NextResponse.json({ error: "Failed to create magazine" }, { status: 500 })
    }

    return NextResponse.json(magazine, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

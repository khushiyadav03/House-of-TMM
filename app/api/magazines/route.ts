import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Regular client for read operations
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Admin client with service role for write operations (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

/**
 * GET /api/magazines
 * Returns every magazine ordered by issue_date (newest first).
 */
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("magazines")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch magazines" }, { status: 500 })
    }

    return NextResponse.json(data ?? [])
  } catch (err) {
    console.error("API error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * POST /api/magazines
 * Creates a new magazine.  Required fields: title, price, issue_date.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, cover_image_url, pdf_file_path, price, issue_date } = body

    if (!title || !price || !issue_date) {
      return NextResponse.json({ error: "Missing required fields: title, price, issue_date" }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from("magazines")
      .insert({
        title,
        description,
        cover_image_url,
        pdf_file_path,
        price: Number(price),
        issue_date,
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create magazine" }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error("API error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

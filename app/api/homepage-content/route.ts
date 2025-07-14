import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Regular client for read operations
const supabase = createClient(supabaseUrl, supabaseKey)

// Admin client with service role for write operations (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function GET() {
  try {
    const { data, error } = await supabase.from("homepage_content").select("*").order("section_name")

    if (error) {
      console.error("Homepage content fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch homepage content" }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { section_name, content } = body

    // Use service role key for admin operations
    const { data, error } = await supabaseAdmin
      .from("homepage_content")
      .upsert({
        section_name,
        content,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "section_name"
      })

    if (error) {
      console.error("Homepage content update error:", error)
      return NextResponse.json({ error: "Failed to update homepage content" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

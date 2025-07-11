import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

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

    const { error } = await supabase.from("homepage_content").upsert({
      section_name,
      content,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Homepage content update error:", error)
      return NextResponse.json({ error: "Failed to update homepage content" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

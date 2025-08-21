import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("brand_images")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      // Table missing ⇒ Postgres error code 42P01
      if ((error as any).code === "42P01") {
        console.warn("brand_images table not found – returning empty array")
        return NextResponse.json([])
      }
      console.error("Brand images fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch brand images" }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, image_url, display_order } = body

    const { data, error } = await supabase
      .from("brand_images")
      .insert({
        title,
        image_url,
        display_order: display_order || 0,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      if ((error as any).code === "42P01") {
        return NextResponse.json({ error: "brand_images table does not exist" }, { status: 400 })
      }
      console.error("Brand image insert error:", error)
      return NextResponse.json({ error: "Failed to create brand image" }, { status: 500 })
    }

    return NextResponse.json({ success: true, image: data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

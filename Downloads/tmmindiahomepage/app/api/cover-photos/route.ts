import { NextRequest, NextResponse } from "next/server"
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
    const { data, error } = await supabase
      .from("cover_photos")
      .select("*")
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Cover photos fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch cover photos" }, { status: 500 })
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
    
    // Use service role key for admin operations
    const { data, error } = await supabaseAdmin
      .from("cover_photos")
      .insert([body])
      .select()

    if (error) {
      console.error("Cover photo creation error:", error)
      return NextResponse.json({ error: "Failed to create cover photo" }, { status: 500 })
    }

    return NextResponse.json(data?.[0] || {})
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 
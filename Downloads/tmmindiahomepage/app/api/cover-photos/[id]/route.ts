import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Regular client for read operations
const supabase = createClient(supabaseUrl, supabaseKey)

// Admin client with service role for write operations (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const id = parseInt(params.id)

    // Use service role key for admin operations
    const { data, error } = await supabaseAdmin
      .from("cover_photos")
      .update(body)
      .eq("id", id)
      .select()

    if (error) {
      console.error("Cover photo update error:", error)
      return NextResponse.json({ error: "Failed to update cover photo" }, { status: 500 })
    }

    return NextResponse.json(data?.[0] || {})
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const id = parseInt(params.id)

    // Use service role key for admin operations
    const { data, error } = await supabaseAdmin
      .from("cover_photos")
      .update(body)
      .eq("id", id)
      .select()

    if (error) {
      console.error("Cover photo update error:", error)
      return NextResponse.json({ error: "Failed to update cover photo" }, { status: 500 })
    }

    return NextResponse.json(data?.[0] || {})
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    // Use service role key for admin operations
    const { error } = await supabaseAdmin
      .from("cover_photos")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Cover photo deletion error:", error)
      return NextResponse.json({ error: "Failed to delete cover photo" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 
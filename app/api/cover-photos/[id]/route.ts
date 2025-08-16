import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = await context.params
    
    const { data, error } = await supabase
      .from("cover_photos")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error("Cover photo fetch error:", error)
      return NextResponse.json({ error: "Cover photo not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = await context.params
    const body = await request.json()
    
    const { data, error } = await supabase
      .from("cover_photos")
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Cover photo update error:", error)
      return NextResponse.json({ error: "Failed to update cover photo" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = await context.params
    
    const { error } = await supabase
      .from("cover_photos")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Cover photo delete error:", error)
      return NextResponse.json({ error: "Failed to delete cover photo" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
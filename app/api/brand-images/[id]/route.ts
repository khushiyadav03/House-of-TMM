import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { data, error } = await supabase.from("brand_images").select("*").eq("id", id).single()

    if (error) {
      return NextResponse.json({ error: "Brand image not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, image_url, display_order, is_active } = body

    const { data, error } = await supabase
      .from("brand_images")
      .update({
        title,
        image_url,
        display_order,
        is_active,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Brand image update error:", error)
      return NextResponse.json({ error: "Failed to update brand image" }, { status: 500 })
    }

    return NextResponse.json({ success: true, brand_image: data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const { data, error } = await supabase.from("brand_images").update(body).eq("id", id).select().single()

    if (error) {
      console.error("Brand image patch error:", error)
      return NextResponse.json({ error: "Failed to update brand image" }, { status: 500 })
    }

    return NextResponse.json({ success: true, brand_image: data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { error } = await supabase.from("brand_images").delete().eq("id", id)

    if (error) {
      console.error("Brand image delete error:", error)
      return NextResponse.json({ error: "Failed to delete brand image" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

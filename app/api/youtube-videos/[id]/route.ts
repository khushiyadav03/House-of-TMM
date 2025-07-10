import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { data, error } = await supabase.from("youtube_videos").select("*").eq("id", id).single()

    if (error) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
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
    const { title, video_url, thumbnail_url, is_main_video, display_order, is_active } = body

    // If setting as main video, first unset all other main videos
    if (is_main_video) {
      await supabase.from("youtube_videos").update({ is_main_video: false }).eq("is_main_video", true).neq("id", id)
    }

    const { data, error } = await supabase
      .from("youtube_videos")
      .update({
        title,
        video_url,
        thumbnail_url,
        is_main_video,
        display_order,
        is_active,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("YouTube video update error:", error)
      return NextResponse.json({ error: "Failed to update video" }, { status: 500 })
    }

    return NextResponse.json({ success: true, video: data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    // If setting as main video, first unset all other main videos
    if (body.is_main_video) {
      await supabase.from("youtube_videos").update({ is_main_video: false }).eq("is_main_video", true).neq("id", id)
    }

    const { data, error } = await supabase.from("youtube_videos").update(body).eq("id", id).select().single()

    if (error) {
      console.error("YouTube video patch error:", error)
      return NextResponse.json({ error: "Failed to update video" }, { status: 500 })
    }

    return NextResponse.json({ success: true, video: data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { error } = await supabase.from("youtube_videos").delete().eq("id", id)

    if (error) {
      console.error("YouTube video delete error:", error)
      return NextResponse.json({ error: "Failed to delete video" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

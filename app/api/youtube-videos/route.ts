import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("youtube_videos")
      .select("*")
      .eq("is_active", true)
      .order("display_order")

    if (error) {
      console.error("YouTube videos fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 })
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
    const { title, video_url, thumbnail_url, is_main_video, display_order } = body

    const { data, error } = await supabase
      .from("youtube_videos")
      .insert({
        title,
        video_url,
        thumbnail_url,
        is_main_video: is_main_video || false,
        display_order: display_order || 0,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error("YouTube video insert error:", error)
      return NextResponse.json({ error: "Failed to create video" }, { status: 500 })
    }

    return NextResponse.json({ success: true, video: data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("youtube_videos")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      if ((error as any).code === "42P01") {
        console.warn("youtube_videos table not found – returning empty array")
        return NextResponse.json([])
      }
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
      if ((error as any).code === "42P01") {
        return NextResponse.json({ error: "youtube_videos table does not exist" }, { status: 400 })
      }
      console.error("YouTube video insert error:", error)
      return NextResponse.json({ error: "Failed to create video" }, { status: 500 })
    }

    return NextResponse.json({ success: true, video: data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

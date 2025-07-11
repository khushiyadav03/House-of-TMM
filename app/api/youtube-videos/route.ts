import { NextResponse, type NextRequest } from "next/server"
import { supabaseServer as supabase } from "@/lib/supabase"

/**
 * GET – list active YouTube videos (main + recommended)
 */
export async function GET() {
  try {
    const { data, error } = await supabase!
      .from("youtube_videos")
      .select("*")
      .eq("is_active", true)
      .order("display_order")

    if (error) {
      // Table may not exist yet – return empty array instead of 500.
      if ((error as any).code === "42P01") {
        console.warn("youtube_videos table not found → returning []")
        return NextResponse.json([])
      }
      console.error("YouTube videos fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 })
    }

    return NextResponse.json(data ?? [])
  } catch (err) {
    console.error("GET /api/youtube-videos crashed:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * POST – admin creates a new video.
 * Accepts: { title, video_url, thumbnail_url, is_main_video?, display_order? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, video_url, thumbnail_url, is_main_video, display_order } = body

    const { data, error } = await supabase!
      .from("youtube_videos")
      .insert(
        {
          title,
          video_url,
          thumbnail_url,
          is_main_video: Boolean(is_main_video),
          display_order: display_order ?? 0,
          is_active: true,
        },
        { defaultToNull: false },
      )
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
  } catch (err) {
    console.error("POST /api/youtube-videos crashed:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

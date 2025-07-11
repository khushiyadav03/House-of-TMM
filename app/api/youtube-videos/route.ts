import { NextResponse, type NextRequest } from "next/server"
import { getSupabaseServer } from "@/lib/supabase"

/**
 * GET /api/youtube-videos
 * Fetches YouTube videos.
 * Query parameters:
 * - limit: number of videos to return (default: 10)
 * - offset: number of videos to skip (default: 0)
 * - is_main_video: boolean to filter by main video status
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServer()
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const isMainVideo = searchParams.get("is_main_video")

    let query = supabase.from("youtube_videos").select("*", { count: "exact" }).eq("is_active", true)

    if (isMainVideo !== null) {
      query = query.eq("is_main_video", isMainVideo === "true")
    }

    query = query.order("display_order", { ascending: true }).order("created_at", { ascending: false })
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      if ((error as any).code === "42P01") {
        console.warn("youtube_videos table not found → returning []")
        return NextResponse.json({ videos: [], total: 0 })
      }
      console.error("YouTube videos fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch YouTube videos" }, { status: 500 })
    }

    return NextResponse.json({ videos: data ?? [], total: count ?? 0 })
  } catch (err) {
    console.error("GET /api/youtube-videos crashed:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

/**
 * POST /api/youtube-videos
 * Creates a new YouTube video entry.
 * Accepts: { title, video_url, thumbnail_url, is_main_video, is_active, display_order }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServer()
    const body = await request.json()
    const { title, video_url, thumbnail_url, is_main_video, is_active, display_order } = body

    const { data, error } = await supabase
      .from("youtube_videos")
      .insert({
        title,
        video_url,
        thumbnail_url,
        is_main_video: Boolean(is_main_video),
        is_active: Boolean(is_active),
        display_order: Number(display_order),
      })
      .select()
      .single()

    if (error) {
      console.error("YouTube video insert error:", error)
      return NextResponse.json({ error: "Failed to create YouTube video" }, { status: 500 })
    }

    return NextResponse.json({ success: true, video: data })
  } catch (err) {
    console.error("POST /api/youtube-videos crashed:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = getSupabaseServer()
    const { data: videos, error } = await supabase
      .from("youtube_videos")
      .select("*")
      .order("display_order", { ascending: true })
      .eq("is_active", true)

    if (error) {
      console.error("YouTube videos fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch YouTube videos", details: error.message }, { status: 500 })
    }

    return NextResponse.json({ videos: videos || [] }, { status: 200 })
  } catch (error: any) {
    console.error("GET /api/youtube-videos crashed:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error.message || "Unknown error" },
      { status: 500 },
    )
  }
}

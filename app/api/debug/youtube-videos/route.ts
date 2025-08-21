import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Check current videos
    const { data: videos, error } = await supabase
      .from("youtube_videos")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({
        error: "Failed to fetch videos",
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      count: videos?.length || 0,
      videos: videos || [],
      mainVideo: videos?.find(v => v.is_main_video) || null,
      recommendedVideos: videos?.filter(v => !v.is_main_video) || []
    })
  } catch (error) {
    return NextResponse.json({
      error: "Debug API error",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST() {
  try {
    // Add sample videos if none exist
    const { data: existingVideos } = await supabase
      .from("youtube_videos")
      .select("id")

    if (existingVideos && existingVideos.length > 0) {
      return NextResponse.json({
        message: "Videos already exist",
        count: existingVideos.length
      })
    }

    const sampleVideos = [
      {
        title: "TMM India - Fashion Week Highlights",
        video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail_url: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
        is_main_video: true,
        display_order: 1,
        is_active: true
      },
      {
        title: "Behind the Scenes - TMM Photoshoot",
        video_url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
        thumbnail_url: "https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg",
        is_main_video: false,
        display_order: 2,
        is_active: true
      },
      {
        title: "TMM India - Lifestyle Tips",
        video_url: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
        thumbnail_url: "https://img.youtube.com/vi/kJQP7kiw5Fk/hqdefault.jpg",
        is_main_video: false,
        display_order: 3,
        is_active: true
      },
      {
        title: "Fashion Trends 2025 - TMM India",
        video_url: "https://www.youtube.com/watch?v=L_jWHffIx5E",
        thumbnail_url: "https://img.youtube.com/vi/L_jWHffIx5E/hqdefault.jpg",
        is_main_video: false,
        display_order: 4,
        is_active: true
      }
    ]

    const { data, error } = await supabase
      .from("youtube_videos")
      .insert(sampleVideos)
      .select()

    if (error) {
      return NextResponse.json({
        error: "Failed to insert sample videos",
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      message: "Sample videos added successfully",
      videos: data
    })
  } catch (error) {
    return NextResponse.json({
      error: "Failed to add sample videos",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
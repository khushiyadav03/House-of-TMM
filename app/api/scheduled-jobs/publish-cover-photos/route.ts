import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Admin client with service role for write operations (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const now = new Date()
    
    // Find all scheduled cover photos that should be published
    const { data: scheduledPhotos, error: fetchError } = await supabaseAdmin
      .from("cover_photos")
      .select("*")
      .eq("status", "scheduled")
      .lte("scheduled_date", now.toISOString())

    if (fetchError) {
      console.error("Error fetching scheduled cover photos:", fetchError)
      return NextResponse.json({ error: "Failed to fetch scheduled cover photos" }, { status: 500 })
    }

    if (!scheduledPhotos || scheduledPhotos.length === 0) {
      return NextResponse.json({ 
        message: "No cover photos to publish", 
        count: 0 
      })
    }

    // Update all scheduled photos to published status
    const { data: updatedPhotos, error: updateError } = await supabaseAdmin
      .from("cover_photos")
      .update({ 
        status: "published", 
        is_active: true,
        updated_at: now.toISOString()
      })
      .eq("status", "scheduled")
      .lte("scheduled_date", now.toISOString())
      .select()

    if (updateError) {
      console.error("Error updating scheduled cover photos:", updateError)
      return NextResponse.json({ error: "Failed to update scheduled cover photos" }, { status: 500 })
    }

    return NextResponse.json({ 
      message: `Successfully published ${updatedPhotos?.length || 0} cover photos`,
      count: updatedPhotos?.length || 0,
      publishedPhotos: updatedPhotos
    })

  } catch (error) {
    console.error("Scheduled job error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET endpoint to check scheduled photos (for manual testing)
export async function GET() {
  try {
    const now = new Date()
    
    const { data: scheduledPhotos, error } = await supabaseAdmin
      .from("cover_photos")
      .select("*")
      .eq("status", "scheduled")
      .order("scheduled_date", { ascending: true })

    if (error) {
      console.error("Error fetching scheduled cover photos:", error)
      return NextResponse.json({ error: "Failed to fetch scheduled cover photos" }, { status: 500 })
    }

    const readyToPublish = scheduledPhotos?.filter(photo => 
      new Date(photo.scheduled_date) <= now
    ) || []

    return NextResponse.json({
      totalScheduled: scheduledPhotos?.length || 0,
      readyToPublish: readyToPublish.length,
      scheduledPhotos: scheduledPhotos || [],
      readyPhotos: readyToPublish
    })

  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 
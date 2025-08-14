import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const adminToken = request.headers.get("x-admin-token")
    if (!adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch recent activities from analytics table
    const { data: analyticsData, error: analyticsError } = await supabaseAdmin
      .from("analytics")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)

    if (analyticsError) {
      console.error("Analytics fetch error:", analyticsError)
    }

    // Fetch recent articles for activity
    const { data: articlesData, error: articlesError } = await supabaseAdmin
      .from("articles")
      .select("id, title, status, created_at, updated_at")
      .order("updated_at", { ascending: false })
      .limit(20)

    if (articlesError) {
      console.error("Articles fetch error:", articlesError)
    }

    // Fetch recent magazines for activity
    const { data: magazinesData, error: magazinesError } = await supabaseAdmin
      .from("magazines")
      .select("id, title, created_at")
      .order("created_at", { ascending: false })
      .limit(10)

    if (magazinesError) {
      console.error("Magazines fetch error:", magazinesError)
    }

    // Combine and format activities
    const activities = []

    // Add article activities
    if (articlesData) {
      articlesData.forEach(article => {
        activities.push({
          id: `article_updated_${article.id}`,
          type: "article_updated",
          title: article.title,
          timestamp: article.updated_at,
        })
        
        if (article.status === 'published') {
          activities.push({
            id: `article_published_${article.id}`,
            type: "article_published",
            title: article.title,
            timestamp: article.created_at,
          })
        }
      })
    }

    // Add magazine activities
    if (magazinesData) {
      magazinesData.forEach(magazine => {
        activities.push({
          id: `magazine_created_${magazine.id}`,
          type: "magazine_created",
          title: magazine.title,
          timestamp: magazine.created_at,
        })
      })
    }

    // Add analytics activities
    if (analyticsData) {
      analyticsData.forEach(analytics => {
        activities.push({
          id: `${analytics.event_type}_${analytics.id}`,
          type: analytics.event_type,
          title: `Content ID: ${analytics.content_id}`,
          timestamp: analytics.created_at,
        })
      })
    }

    // Sort by timestamp and limit
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    const recentActivities = activities.slice(0, 20)

    return NextResponse.json({ activities: recentActivities })
  } catch (error) {
    console.error("Activity API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
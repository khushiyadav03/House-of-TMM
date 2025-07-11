import { NextResponse, type NextRequest } from "next/server"
import { getSupabaseServer } from "@/lib/supabase"

/**
 * GET /api/brand-images
 * Fetches brand images.
 * Query parameters:
 * - limit: number of images to return (default: 10)
 * - offset: number of images to skip (default: 0)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServer()
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const {
      data: brandImages,
      error,
      count,
    } = await supabase
      .from("brand_images")
      .select("*", { count: "exact" })
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      if ((error as any).code === "42P01") {
        console.warn("brand_images table not found → returning []")
        return NextResponse.json({ brandImages: [], total: 0 })
      }
      console.error("Brand images fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch brand images", details: error.message }, { status: 500 })
    }

    return NextResponse.json({ brandImages: brandImages ?? [], total: count ?? 0 })
  } catch (err) {
    console.error("GET /api/brand-images crashed:", err)
    return NextResponse.json(
      { error: "Internal server error", details: (err as Error).message || "Unknown error" },
      { status: 500 },
    )
  }
}

/**
 * POST /api/brand-images
 * Creates a new brand image entry.
 * Accepts: { title, image_url, is_active, display_order }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServer()
    const body = await request.json()
    const { title, image_url, is_active, display_order } = body

    const { data, error } = await supabase
      .from("brand_images")
      .insert({
        title,
        image_url,
        is_active: Boolean(is_active),
        display_order: Number(display_order),
      })
      .select()
      .single()

    if (error) {
      console.error("Brand image insert error:", error)
      return NextResponse.json({ error: "Failed to create brand image", details: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, brandImage: data })
  } catch (err) {
    console.error("POST /api/brand-images crashed:", err)
    return NextResponse.json(
      { error: "Internal server error", details: (err as Error).message || "Unknown error" },
      { status: 500 },
    )
  }
}

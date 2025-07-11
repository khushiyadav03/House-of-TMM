import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase"

export async function GET() {
  const supabase = getSupabaseServer()
  try {
    const { data: brandImages, error } = await supabase
      .from("brand_images")
      .select("*")
      .order("created_at", { ascending: false }) // Sort by latest

    if (error) {
      // If the table doesn't exist, return an empty array instead of an error
      if (error.code === "42P01") {
        // PostgreSQL error code for "undefined_table"
        console.warn("Table 'brand_images' does not exist. Returning empty array.")
        return NextResponse.json({ brandImages: [] })
      }
      console.error("Brand images fetch error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ brandImages })
  } catch (error: any) {
    console.error("Brand images fetch error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const supabase = getSupabaseServer()
  try {
    const newImage = await request.json()
    const { data, error } = await supabase.from("brand_images").insert(newImage).select().single()

    if (error) {
      console.error("Error creating brand image:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error("Error creating brand image:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase"

export async function GET() {
  const supabase = getSupabaseServer()
  try {
    const { data: categories, error } = await supabase.from("categories").select("*").order("name", { ascending: true })

    if (error) {
      console.error("Categories fetch error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(categories)
  } catch (error: any) {
    console.error("Categories fetch error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const supabase = getSupabaseServer()
  try {
    const newCategory = await request.json()
    const { data, error } = await supabase.from("categories").insert(newCategory).select().single()

    if (error) {
      console.error("Error creating category:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

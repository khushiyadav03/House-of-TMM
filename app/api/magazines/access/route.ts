import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const magazineId = searchParams.get("magazine_id")
    
    if (!magazineId) {
      return NextResponse.json({ error: "Magazine ID is required" }, { status: 400 })
    }

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ hasAccess: false, requiresAuth: true })
    }

    // Check if magazine is free
    const { data: magazine } = await supabase
      .from("magazines")
      .select("is_paid")
      .eq("id", magazineId)
      .single()

    if (!magazine?.is_paid) {
      return NextResponse.json({ hasAccess: true, requiresAuth: false })
    }

    // Check if user has purchased the magazine
    const { data: access } = await supabase
      .from("magazine_access")
      .select("*")
      .eq("user_id", user.id)
      .eq("magazine_id", magazineId)
      .eq("is_active", true)
      .single()

    return NextResponse.json({ 
      hasAccess: !!access, 
      requiresAuth: false,
      requiresPayment: !access 
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { magazine_id, purchase_id } = body

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Grant magazine access
    const { data, error } = await supabase
      .from("magazine_access")
      .insert({
        user_id: user.id,
        magazine_id,
        purchase_id,
        is_active: true
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to grant access" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

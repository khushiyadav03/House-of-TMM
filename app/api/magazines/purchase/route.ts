import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import Razorpay from "razorpay"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { magazine_id, user_email, payment_method_id } = body

    if (!magazine_id || !user_email) {
      return NextResponse.json({ error: "Missing required fields: magazine_id, user_email" }, { status: 400 })
    }

    // Get magazine details
    const { data: magazine, error: magazineError } = await supabase
      .from("magazines")
      .select("*")
      .eq("id", magazine_id)
      .single()

    if (magazineError || !magazine) {
      return NextResponse.json({ error: "Magazine not found" }, { status: 404 })
    }

    // Check if user already purchased this magazine
    const { data: existingPurchase } = await supabase
      .from("magazine_purchases")
      .select("*")
      .eq("magazine_id", magazine_id)
      .eq("user_email", user_email)
      .single()

    if (existingPurchase) {
      return NextResponse.json({
        success: true,
        message: "Already purchased",
        purchase: existingPurchase,
        magazine,
      })
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(magazine.price * 100), // Convert to paise
      currency: "INR",
      receipt: `magazine_${magazine_id}_${Date.now()}`,
      notes: {
        magazine_id: magazine_id.toString(),
        user_email,
        magazine_title: magazine.title,
      },
    })

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      magazine,
    })
  } catch (error: any) {
    console.error("Payment error:", error)
    return NextResponse.json(
      {
        error: error.message || "Payment processing failed",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_email = searchParams.get("user_email")

    if (!user_email) {
      return NextResponse.json({ error: "Missing user_email parameter" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("magazine_purchases")
      .select(`
        *,
        magazines(*)
      `)
      .eq("user_email", user_email)
      .order("purchase_date", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch purchases" }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

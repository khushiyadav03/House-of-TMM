import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { magazine_id, user_email } = body

    if (!magazine_id || !user_email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
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

    // Check if already purchased
    const { data: existingPurchase } = await supabase
      .from("magazine_purchases")
      .select("*")
      .eq("magazine_id", magazine_id)
      .eq("user_email", user_email)
      .single()

    if (existingPurchase) {
      return NextResponse.json(
        {
          error: "Already purchased",
          existing_purchase: true,
        },
        { status: 400 },
      )
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(magazine.price * 100), // Convert to paise
      currency: "inr",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        magazine_id: magazine_id.toString(),
        user_email,
        magazine_title: magazine.title,
      },
    })

    return NextResponse.json({
      client_secret: paymentIntent.client_secret,
      magazine,
    })
  } catch (error: any) {
    console.error("Payment intent creation error:", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to create payment intent",
      },
      { status: 500 },
    )
  }
}

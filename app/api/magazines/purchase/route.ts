import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
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

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(magazine.price * 100), // Convert to paise/cents
      currency: "inr", // Change to "usd" if needed
      payment_method: payment_method_id,
      confirmation_method: "manual",
      confirm: true,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/magazine?purchase=success`,
      metadata: {
        magazine_id: magazine_id.toString(),
        user_email,
        magazine_title: magazine.title,
      },
    })

    if (paymentIntent.status === "succeeded") {
      // Create purchase record
      const { data: purchase, error: purchaseError } = await supabase
        .from("magazine_purchases")
        .insert({
          magazine_id,
          user_email,
          payment_status: "completed",
          payment_id: paymentIntent.id,
          amount: magazine.price,
        })
        .select()
        .single()

      if (purchaseError) {
        console.error("Purchase insert error:", purchaseError)
        return NextResponse.json({ error: "Failed to create purchase record" }, { status: 500 })
      }

      // Update magazine sales count
      await supabase
        .from("magazines")
        .update({ sales_count: (magazine.sales_count || 0) + 1 })
        .eq("id", magazine_id)

      return NextResponse.json({
        success: true,
        message: "Purchase successful",
        purchase,
        magazine,
        payment_intent: paymentIntent,
        download_url: magazine.pdf_file_path,
      })
    } else if (paymentIntent.status === "requires_action") {
      return NextResponse.json({
        requires_action: true,
        payment_intent: {
          id: paymentIntent.id,
          client_secret: paymentIntent.client_secret,
        },
      })
    } else {
      return NextResponse.json(
        {
          error: "Payment failed",
          payment_intent: paymentIntent,
        },
        { status: 400 },
      )
    }
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

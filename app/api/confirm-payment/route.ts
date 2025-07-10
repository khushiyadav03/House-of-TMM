import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { payment_intent_id } = body

    if (!payment_intent_id) {
      return NextResponse.json({ error: "Missing payment_intent_id" }, { status: 400 })
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id)

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
    }

    const magazine_id = Number.parseInt(paymentIntent.metadata.magazine_id)
    const user_email = paymentIntent.metadata.user_email

    // Check if purchase record already exists
    const { data: existingPurchase } = await supabase
      .from("magazine_purchases")
      .select("*")
      .eq("payment_id", payment_intent_id)
      .single()

    if (existingPurchase) {
      return NextResponse.json({
        success: true,
        message: "Purchase already recorded",
        purchase: existingPurchase,
      })
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

    // Create purchase record
    const { data: purchase, error: purchaseError } = await supabase
      .from("magazine_purchases")
      .insert({
        magazine_id,
        user_email,
        payment_status: "completed",
        payment_id: payment_intent_id,
        amount: paymentIntent.amount / 100, // Convert back from paise
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
      message: "Purchase confirmed",
      purchase,
      magazine,
      download_url: magazine.pdf_file_path,
    })
  } catch (error: any) {
    console.error("Payment confirmation error:", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to confirm payment",
      },
      { status: 500 },
    )
  }
}

import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { supabase } from "@/lib/supabase"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId } = await request.json()

    if (!paymentIntentId) {
      return NextResponse.json({ error: "Payment intent ID is required" }, { status: 400 })
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 })
    }

    const magazineId = paymentIntent.metadata.magazineId
    const customerEmail = paymentIntent.metadata.customerEmail

    if (!magazineId) {
      return NextResponse.json({ error: "Magazine ID not found in payment" }, { status: 400 })
    }

    // Check if purchase already exists
    const { data: existingPurchase } = await supabase
      .from("magazine_purchases")
      .select("id")
      .eq("stripe_payment_intent_id", paymentIntentId)
      .single()

    if (existingPurchase) {
      return NextResponse.json({
        success: true,
        message: "Purchase already recorded",
        purchaseId: existingPurchase.id,
      })
    }

    // Get magazine details
    const { data: magazine, error: magazineError } = await supabase
      .from("magazines")
      .select("*")
      .eq("id", Number.parseInt(magazineId))
      .single()

    if (magazineError || !magazine) {
      return NextResponse.json({ error: "Magazine not found" }, { status: 404 })
    }

    // Record the purchase
    const { data: purchase, error: purchaseError } = await supabase
      .from("magazine_purchases")
      .insert({
        magazine_id: Number.parseInt(magazineId),
        customer_email: customerEmail,
        amount: paymentIntent.amount / 100, // Convert from cents
        currency: paymentIntent.currency,
        stripe_payment_intent_id: paymentIntentId,
        purchase_date: new Date().toISOString(),
      })
      .select()
      .single()

    if (purchaseError) {
      console.error("Failed to record purchase:", purchaseError)
      return NextResponse.json({ error: "Failed to record purchase" }, { status: 500 })
    }

    // Update magazine sales count
    await supabase
      .from("magazines")
      .update({
        sales_count: (magazine.sales_count || 0) + 1,
      })
      .eq("id", Number.parseInt(magazineId))

    return NextResponse.json({
      success: true,
      message: "Purchase completed successfully",
      purchaseId: purchase.id,
      magazine: {
        title: magazine.title,
        pdf_url: magazine.pdf_url,
      },
    })
  } catch (error) {
    console.error("Payment confirmation failed:", error)
    return NextResponse.json({ error: "Failed to confirm payment" }, { status: 500 })
  }
}

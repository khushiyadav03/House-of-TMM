import { NextResponse } from "next/server"
import Stripe from "stripe"
import { getSupabaseServer } from "@/lib/supabase"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(req: Request) {
  const supabase = getSupabaseServer()
  try {
    const { paymentIntentId, paymentMethodDetails } = await req.json()

    if (!paymentIntentId) {
      return NextResponse.json({ error: "Payment Intent ID is required" }, { status: 400 })
    }

    // Retrieve the PaymentIntent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (!paymentIntent) {
      return NextResponse.json({ error: "Payment Intent not found" }, { status: 404 })
    }

    // Confirm the PaymentIntent
    const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntent.id, {
      payment_method: paymentMethodDetails,
    })

    if (confirmedPaymentIntent.status === "succeeded") {
      // Payment succeeded, now record the purchase in Supabase
      const magazineId = confirmedPaymentIntent.metadata.magazineId
      const customerEmail = confirmedPaymentIntent.metadata.customerEmail

      if (magazineId && customerEmail) {
        const { data, error } = await supabase.from("purchases").insert([
          {
            magazine_id: Number.parseInt(magazineId),
            customer_email: customerEmail,
            payment_intent_id: confirmedPaymentIntent.id,
            amount: confirmedPaymentIntent.amount / 100, // Convert cents back to currency unit
            currency: confirmedPaymentIntent.currency,
            status: confirmedPaymentIntent.status,
          },
        ])

        if (error) {
          console.error("Error recording purchase in Supabase:", error)
          // Even if Supabase fails, the Stripe payment succeeded, so we might still return success to user
          return NextResponse.json({ success: true, message: "Payment succeeded, but failed to record purchase." })
        }
      }

      return NextResponse.json({ success: true, message: "Payment successful!" })
    } else {
      return NextResponse.json({ success: false, message: `Payment status: ${confirmedPaymentIntent.status}` })
    }
  } catch (error: any) {
    console.error("Error confirming payment:", error)
    return NextResponse.json({ success: false, error: error.message || "Payment confirmation failed" }, { status: 500 })
  }
}

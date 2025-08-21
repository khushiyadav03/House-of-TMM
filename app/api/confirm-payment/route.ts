import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, magazineId, customerEmail } = await request.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment verification data" }, { status: 400 })
    }

    // Verify payment signature with Razorpay
    const crypto = require('crypto')
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex')

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
    }

    if (!magazineId) {
      return NextResponse.json({ error: "Magazine ID not found" }, { status: 400 })
    }

    // Check if purchase already exists
    const { data: existingPurchase } = await supabase
      .from("magazine_purchases")
      .select("id")
      .eq("razorpay_payment_id", razorpay_payment_id)
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
        amount: magazine.price,
        currency: 'INR',
        razorpay_order_id: razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id,
        payment_status: 'completed',
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

import { type NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = "INR", magazineId, customerEmail } = await request.json()

    if (!amount || amount < 1) {
      return NextResponse.json({ error: "Amount must be at least ₹1" }, { status: 400 })
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: `magazine_${magazineId}_${Date.now()}`,
      notes: {
        magazineId: magazineId?.toString() || "",
        customerEmail: customerEmail || "",
      },
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    })
  } catch (error) {
    console.error("Payment order creation failed:", error)
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 })
  }
}

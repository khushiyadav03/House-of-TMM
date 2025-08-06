/**
 * @file app/api/razorpay/verify/route.ts
 * @description API route to verify a Razorpay payment signature.
 * This endpoint is called by the frontend after payment. It verifies the signature
 * and updates the purchase record in the DB to 'completed' if valid, 'failed' if not.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Get Razorpay secret key for signature verification
const secret = process.env.RAZORPAY_KEY_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, magazineId, userEmail } =
      await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment verification parameters" },
        { status: 400 }
      );
    }

    // Verify the signature with Razorpay
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isSignatureValid = generated_signature === razorpay_signature;

    if (isSignatureValid) {
      // Update the payment status in the database
      const { error: dbError } = await supabase
        .from("magazine_purchases")
        .update({ 
          payment_status: "completed",
          payment_id: razorpay_payment_id,
          purchase_date: new Date().toISOString()
        })
        .eq("payment_id", razorpay_order_id); // Find by order ID

      if (dbError) {
        console.error("Database error:", dbError);
        return NextResponse.json(
          { error: "Failed to update payment status" },
          { status: 500 }
        );
      }

      // Update magazine sales count
      const { error: magazineUpdateError } = await supabase
        .rpc('increment_magazine_sales', { magazine_id_param: magazineId });

      if (magazineUpdateError) {
        console.error("Error updating magazine sales count:", magazineUpdateError);
        // Continue anyway as the purchase is already recorded
      }

      return NextResponse.json({ success: true });
    } else {
      // Update the payment status to failed
      await supabase
        .from("magazine_purchases")
        .update({ payment_status: "failed" })
        .eq("payment_id", razorpay_order_id);

      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error processing payment verification:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
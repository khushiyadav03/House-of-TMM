/**
 * @file app/api/razorpay/verify/route.ts
 * @description API route to verify a Razorpay payment signature.
 * This endpoint is called by the frontend after payment. It verifies the signature
 * and updates the purchase record in the DB to 'completed' if valid, 'failed' if not.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as crypto from 'crypto';

// Initialize Supabase client
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, magazineId, userEmail } =
      await request.json();

    // Validate required parameters
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment verification parameters" },
        { status: 400 }
      );
    }

    if (!magazineId || !userEmail) {
      return NextResponse.json(
        { error: "Missing magazine or user information" },
        { status: 400 }
      );
    }

    // Get Razorpay secret key for signature verification
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error('Razorpay secret key not configured');
      return NextResponse.json(
        { error: "Payment system configuration error" },
        { status: 500 }
      );
    }

    // Verify the signature with Razorpay
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isSignatureValid = generated_signature === razorpay_signature;

    console.log('Payment verification:', {
      razorpay_order_id,
      razorpay_payment_id,
      isSignatureValid,
      magazineId,
      userEmail
    });

    const supabase = getSupabaseAdmin();

    if (isSignatureValid) {
      // Check if purchase record exists
      const { data: existingPurchase, error: fetchError } = await supabase
        .from("magazine_purchases")
        .select("*")
        .eq("razorpay_order_id", razorpay_order_id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error("Error fetching purchase record:", fetchError);
        return NextResponse.json(
          { error: "Failed to verify purchase record" },
          { status: 500 }
        );
      }

      if (!existingPurchase) {
        console.error("Purchase record not found for order:", razorpay_order_id);
        return NextResponse.json(
          { error: "Purchase record not found" },
          { status: 404 }
        );
      }

      // Update the payment status in the database
      const { error: dbError } = await supabase
        .from("magazine_purchases")
        .update({ 
          payment_status: "completed",
          razorpay_payment_id: razorpay_payment_id,
          purchase_date: new Date().toISOString()
        })
        .eq("razorpay_order_id", razorpay_order_id);

      if (dbError) {
        console.error("Database error updating payment status:", dbError);
        return NextResponse.json(
          { error: "Failed to update payment status" },
          { status: 500 }
        );
      }

      // Update magazine sales count
      const { error: magazineUpdateError } = await supabase
        .rpc('increment_magazine_sales', { magazine_id_param: parseInt(magazineId) });

      if (magazineUpdateError) {
        console.error("Error updating magazine sales count:", magazineUpdateError);
        // Continue anyway as the purchase is already recorded
      }

      console.log('Payment verified successfully:', {
        razorpay_order_id,
        razorpay_payment_id,
        magazineId,
        userEmail
      });

      return NextResponse.json({ success: true });
    } else {
      console.log('Invalid payment signature:', {
        razorpay_order_id,
        razorpay_payment_id,
        generated_signature,
        received_signature: razorpay_signature
      });

      // Update the payment status to failed
      await supabase
        .from("magazine_purchases")
        .update({ 
          payment_status: "failed",
          razorpay_payment_id: razorpay_payment_id
        })
        .eq("razorpay_order_id", razorpay_order_id);

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
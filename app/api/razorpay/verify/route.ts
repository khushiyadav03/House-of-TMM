/**
 * @file app/api/razorpay/verify/route.ts
 * @description API route to verify a Razorpay payment signature (mock version).
 * This endpoint is called by the frontend after payment. It mocks signature verification
 * and updates the purchase record in the DB to 'completed' if valid, 'failed' if not.
 * When ready for real integration, uncomment the crypto logic and add your keys.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
// import crypto from 'crypto'; // Uncomment for real integration

export async function POST(req: NextRequest) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

  // --- REAL SIGNATURE VERIFICATION (UNCOMMENT WHEN READY) ---
  /*
  const key_secret = process.env.RAZORPAY_KEY_SECRET!;
  const generated_signature = crypto
    .createHmac('sha256', key_secret)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');
  const isSignatureValid = generated_signature === razorpay_signature;
  */

  // --- MOCK VERIFICATION FOR DEVELOPMENT ---
  const isSignatureValid = true;

  if (isSignatureValid) {
    // Update the purchase record to 'completed'
    const { error } = await supabase
      .from('magazine_purchases')
      .update({
        payment_status: 'completed',
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature,
        purchase_date: new Date().toISOString(),
      })
      .eq('razorpay_order_id', razorpay_order_id);

    if (error) {
      console.error('Supabase error during verification:', error);
      return NextResponse.json({ error: 'Database error while verifying payment.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } else {
    // Update the purchase record to 'failed'
    await supabase
      .from('magazine_purchases')
      .update({ payment_status: 'failed' })
      .eq('razorpay_order_id', razorpay_order_id);

    return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
  }
} 
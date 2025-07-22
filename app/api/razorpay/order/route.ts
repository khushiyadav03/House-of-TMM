/**
 * @file app/api/razorpay/order/route.ts
 * @description API route to create a Razorpay payment order (mock version).
 * This endpoint is called by the frontend before initiating the payment process.
 * It creates a 'pending' purchase record in the Supabase database and returns a mock order object.
 * When ready for real integration, uncomment the Razorpay logic and add your keys.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
// import Razorpay from 'razorpay'; // Uncomment for real integration

export async function POST(req: NextRequest) {
  const { magazineId, userEmail, amount } = await req.json();

  if (!magazineId || !userEmail || !amount) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // --- REAL RAZORPAY LOGIC (UNCOMMENT WHEN READY) ---
  /*
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
  const options = {
    amount: amount * 100, // in paise
    currency: 'INR',
    receipt: `receipt_mag_${magazineId}_${Date.now()}`,
  };
  const order = await razorpay.orders.create(options);
  */

  // --- MOCK ORDER FOR DEVELOPMENT ---
  const order = {
    id: `mock_order_${Date.now()}`,
    amount: amount * 100,
    currency: 'INR',
    receipt: `receipt_mag_${magazineId}_${Date.now()}`,
  };

  // Insert a pending purchase record into the database
  const { error } = await supabase
    .from('magazine_purchases')
    .insert({
      magazine_id: magazineId,
      user_email: userEmail,
      amount: amount,
      payment_status: 'pending',
      razorpay_order_id: order.id,
    });

  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: 'Database error while creating purchase record.' }, { status: 500 });
  }

  return NextResponse.json(order);
} 
/**
 * @file app/api/razorpay/order/route.ts
 * @description API route to create a Razorpay payment order.
 * This endpoint is called by the frontend before initiating the payment process.
 * It creates a 'pending' purchase record in the Supabase database and returns the order object.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Razorpay from 'razorpay';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  const { magazineId, userEmail, amount } = await req.json();

  if (!magazineId || !userEmail || !amount) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Initialize Razorpay with your API keys
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
  
  // Create payment options
  const options = {
    amount: amount, // amount in smallest currency unit (paise for INR)
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
    notes: {
      magazineId: magazineId.toString(),
      userEmail: userEmail
    }
  };
  
  // Create the order in Razorpay
  let order;
  try {
    order = await razorpay.orders.create(options);
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return NextResponse.json({ error: 'Failed to create Razorpay order' }, { status: 500 });
  }

  // Insert a pending purchase record into the database
  const { error } = await supabase
    .from('magazine_purchases')
    .insert({
      magazine_id: magazineId,
      user_email: userEmail,
      purchase_date: new Date().toISOString(),
      amount: amount / 100, // Convert from paisa to rupees for storage
      payment_status: 'pending',
      payment_id: order.id,
    });

  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: 'Database error while creating purchase record.' }, { status: 500 });
  }

  return NextResponse.json(order);
}
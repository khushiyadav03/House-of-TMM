/**
 * @file app/api/razorpay/guest-order/route.ts
 * @description API route to create a Razorpay payment order for guest users.
 * This endpoint creates an order without requiring authentication.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
const Razorpay = require('razorpay');

// Initialize Supabase client
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  try {
    const { magazineId, amount, userDetails } = await req.json();

    if (!magazineId || !amount || !userDetails) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate user details
    if (!userDetails.name || !userDetails.email || !userDetails.phone) {
      return NextResponse.json({ error: 'Missing user details' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userDetails.email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Validate amount
    if (amount <= 0 || amount > 10000000) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Check if Razorpay keys are configured
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Razorpay keys not configured');
      return NextResponse.json({ error: 'Payment system not configured. Please contact support.' }, { status: 500 });
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // Create payment options
    const options = {
      amount: amount,
      currency: 'INR',
      receipt: `receipt_guest_${Date.now()}`,
      notes: {
        magazineId: magazineId.toString(),
        guestUser: 'true',
        userName: userDetails.name,
        userEmail: userDetails.email,
        userPhone: userDetails.phone,
        platform: 'TMM_India_Website'
      }
    };

    // Create the order in Razorpay
    console.log('Creating Razorpay order for guest user:', { 
      magazineId, 
      userEmail: userDetails.email, 
      amount: amount / 100 
    });
    
    const order = await razorpay.orders.create(options);
    console.log('Razorpay order created successfully:', order.id);

    // Guest order created successfully - no database storage needed
    // User details are stored in Razorpay order notes for later retrieval

    return NextResponse.json(order);
  } catch (error) {
    console.error('Guest order creation error:', error);
    
    if (error && typeof error === 'object' && 'error' in error) {
      const razorpayError = error as any;
      return NextResponse.json({ 
        error: 'Payment system error', 
        details: razorpayError.error?.description || 'Failed to create payment order'
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to create payment order',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
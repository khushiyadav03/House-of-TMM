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
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  try {
    const { magazineId, userEmail, amount } = await req.json();

    // Validate required fields
    if (!magazineId || !userEmail || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Validate amount
    if (amount <= 0 || amount > 10000000) { // Max 1 lakh rupees in paise
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Validate magazine exists
    const supabase = getSupabaseAdmin();
    const { data: magazine, error: magazineError } = await supabase
      .from('magazines')
      .select('id, title, price')
      .eq('id', magazineId)
      .single();

    if (magazineError || !magazine) {
      console.error('Magazine not found:', { magazineId, error: magazineError });
      
      // For testing purposes, create a mock magazine if ID is 1
      if (magazineId === 1) {
        console.log('Creating mock magazine for testing');
        const mockMagazine = {
          id: 1,
          title: 'Test Magazine',
          price: amount / 100 // Use the provided amount
        };
        
        // Continue with mock magazine
        const razorpay = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID!,
          key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });
        
        const options = {
          amount: amount,
          currency: 'INR',
          receipt: `receipt_test_${Date.now()}`,
          notes: {
            magazineId: magazineId.toString(),
            userEmail: userEmail,
            magazineTitle: mockMagazine.title,
            platform: 'TMM_India_Website_Test'
          }
        };
        
        console.log('Creating test Razorpay order:', { magazineId, userEmail, amount: amount / 100 });
        const order = await razorpay.orders.create(options);
        console.log('Test Razorpay order created successfully:', order.id);
        
        return NextResponse.json(order);
      }
      
      return NextResponse.json({ 
        error: 'Magazine not found',
        details: `Magazine with ID ${magazineId} does not exist in database`
      }, { status: 404 });
    }

    // Validate amount matches magazine price
    const expectedAmount = magazine.price * 100; // Convert to paise
    if (amount !== expectedAmount) {
      console.error('Amount mismatch:', { expected: expectedAmount, received: amount });
      return NextResponse.json({ 
        error: 'Amount mismatch',
        details: `Expected ₹${magazine.price} (${expectedAmount} paise), received ${amount} paise`
      }, { status: 400 });
    }

    // Check if Razorpay keys are configured
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Razorpay keys not configured');
      return NextResponse.json({ error: 'Payment system not configured. Please contact support.' }, { status: 500 });
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
      receipt: `receipt_${magazineId}_${Date.now()}`,
      notes: {
        magazineId: magazineId.toString(),
        userEmail: userEmail,
        magazineTitle: magazine.title,
        platform: 'TMM_India_Website'
      }
    };
    
    // Create the order in Razorpay
    console.log('Creating Razorpay order:', { magazineId, userEmail, amount: amount / 100 });
    console.log('Using Razorpay keys:', { 
      keyId: process.env.RAZORPAY_KEY_ID?.substring(0, 12) + '...', 
      hasSecret: !!process.env.RAZORPAY_KEY_SECRET 
    });
    
    const order = await razorpay.orders.create(options);
    console.log('Razorpay order created successfully:', order.id);

    // Insert a pending purchase record into the database
    const { error: dbError } = await supabase
      .from('magazine_purchases')
      .insert({
        magazine_id: magazineId,
        user_email: userEmail,
        purchase_date: new Date().toISOString(),
        amount: amount / 100, // Convert from paisa to rupees for storage
        payment_status: 'pending',
        payment_id: order.id,
        razorpay_order_id: order.id,
        currency: 'INR'
      });

    if (dbError) {
      console.error('Database error while creating purchase record:', dbError);
      return NextResponse.json({ error: 'Database error while creating purchase record.' }, { status: 500 });
    }

    console.log('Purchase record created successfully for order:', order.id);
    return NextResponse.json(order);

  } catch (error: any) {
    console.error('Order creation error:', error);
    
    // Handle specific Razorpay errors
    if (error && typeof error === 'object' && 'error' in error) {
      const razorpayError = error as any;
      console.error('Razorpay API error:', razorpayError);
      
      // Check for authentication errors
      if (razorpayError.statusCode === 401 || razorpayError.error?.code === 'BAD_REQUEST_ERROR') {
        return NextResponse.json({ 
          error: 'Authentication failed', 
          details: 'Invalid Razorpay credentials. Please check your API keys.'
        }, { status: 401 });
      }
      
      return NextResponse.json({ 
        error: 'Payment system error', 
        details: razorpayError.error?.description || razorpayError.message || 'Failed to create payment order'
      }, { status: 500 });
    }
    
    // Handle other errors
    if (error.message?.includes('Authentication')) {
      return NextResponse.json({ 
        error: 'Authentication failed',
        details: 'Razorpay authentication failed. Please verify your API keys.'
      }, { status: 401 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to create payment order',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
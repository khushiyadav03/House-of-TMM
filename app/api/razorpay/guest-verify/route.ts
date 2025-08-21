/**
 * @file app/api/razorpay/guest-verify/route.ts
 * @description API route to verify guest payment and create user account.
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
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      magazineId,
      userDetails
    } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment verification parameters" },
        { status: 400 }
      );
    }

    if (!userDetails || !userDetails.email || !userDetails.password) {
      return NextResponse.json(
        { error: "Missing user details" },
        { status: 400 }
      );
    }

    // Verify the signature with Razorpay
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isSignatureValid = generated_signature === razorpay_signature;

    if (!isSignatureValid) {
      console.log('Invalid payment signature:', {
        razorpay_order_id,
        razorpay_payment_id,
        generated_signature,
        received_signature: razorpay_signature
      });

      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Payment is valid - now create user account and purchase record
    console.log('Payment verified successfully for guest user:', {
      razorpay_order_id,
      razorpay_payment_id,
      magazineId,
      userEmail: userDetails.email
    });

    // Step 1: Create user account using Supabase Admin API
    let userData: any;
    let userId: string;

    try {
      const supabaseAdmin = getSupabaseAdmin();
      const { data: newUserData, error: userError } = await supabaseAdmin.auth.admin.createUser({
        email: userDetails.email,
        password: userDetails.password,
        email_confirm: true, // Auto-confirm email for guest purchases
        user_metadata: {
          name: userDetails.name,
          phone: userDetails.phone,
          created_via: 'guest_checkout'
        }
      });

      if (userError) {
        // Check if user already exists
        if (userError.message.includes('already registered')) {
          // User already exists - get their ID
          const { data: existingUserData, error: fetchError } = await supabaseAdmin.auth.admin.listUsers();

          if (fetchError) {
            throw new Error("Failed to fetch existing user");
          }

          const existingUser = existingUserData.users.find(u => u.email === userDetails.email);
          if (existingUser) {
            userId = existingUser.id;
          } else {
            throw new Error("User exists but could not be found");
          }
        } else {
          throw userError;
        }
      } else {
        userId = newUserData.user.id;
      }
    } catch (error) {
      console.error('Error with user account:', error);
      return NextResponse.json(
        { error: "User account creation failed" },
        { status: 500 }
      );
    }
    if (!userId) {
      return NextResponse.json(
        { error: "Failed to get user ID" },
        { status: 500 }
      );
    }

    // Step 2: Create purchase record
    const supabaseAdmin = getSupabaseAdmin();
    const { error: purchaseError } = await supabaseAdmin
      .from('magazine_purchases')
      .insert({
        user_id: userId,
        magazine_id: parseInt(magazineId),
        payment_id: razorpay_order_id,
        razorpay_order_id: razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id,
        amount: 0, // Will be updated from guest_orders table
        currency: 'INR',
        payment_status: 'completed',
        purchase_date: new Date().toISOString()
      });

    if (purchaseError) {
      console.error('Error creating purchase record:', purchaseError);
      // Continue anyway - user account is created
    }

    // Step 3: Update magazine sales count
    const { error: magazineUpdateError } = await supabaseAdmin
      .rpc('increment_magazine_sales', { magazine_id_param: parseInt(magazineId) });

    if (magazineUpdateError) {
      console.error("Error updating magazine sales count:", magazineUpdateError);
    }

    // Guest order processing completed successfully

    return NextResponse.json({
      success: true,
      message: "Account created and payment verified successfully"
    });

  } catch (error) {
    console.error("Error processing guest payment verification:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function GET(req: NextRequest) {
  try {
    // Check if keys are configured
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ 
        success: false,
        error: 'Razorpay keys not configured',
        details: 'RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET missing'
      }, { status: 500 });
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    console.log('Testing Razorpay authentication with keys:', {
      keyId: process.env.RAZORPAY_KEY_ID?.substring(0, 12) + '...',
      hasSecret: !!process.env.RAZORPAY_KEY_SECRET,
      keyType: process.env.RAZORPAY_KEY_ID?.startsWith('rzp_live_') ? 'LIVE' : 'TEST'
    });

    // Try to fetch orders (this will test authentication)
    const orders = await razorpay.orders.all({ count: 1 });
    
    return NextResponse.json({
      success: true,
      message: 'Razorpay authentication successful',
      keyType: process.env.RAZORPAY_KEY_ID?.startsWith('rzp_live_') ? 'LIVE' : 'TEST',
      keyId: process.env.RAZORPAY_KEY_ID?.substring(0, 12) + '...',
      ordersCount: orders.count || 0
    });

  } catch (error: any) {
    console.error('Razorpay authentication test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Authentication failed',
      details: error.message || 'Unknown error',
      statusCode: error.statusCode,
      keyType: process.env.RAZORPAY_KEY_ID?.startsWith('rzp_live_') ? 'LIVE' : 'TEST'
    }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const config = {
      hasRazorpayKeyId: !!process.env.RAZORPAY_KEY_ID,
      hasRazorpayKeySecret: !!process.env.RAZORPAY_KEY_SECRET,
      hasPublicRazorpayKeyId: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      razorpayKeyIdLength: process.env.RAZORPAY_KEY_ID?.length || 0,
      publicRazorpayKeyIdLength: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.length || 0,
      razorpayKeyIdPrefix: process.env.RAZORPAY_KEY_ID?.substring(0, 8) || 'Not set',
      publicRazorpayKeyIdPrefix: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.substring(0, 8) || 'Not set',
    };

    return NextResponse.json({
      success: true,
      config,
      allConfigured: config.hasRazorpayKeyId && 
                     config.hasRazorpayKeySecret && 
                     config.hasPublicRazorpayKeyId && 
                     config.hasSupabaseUrl && 
                     config.hasSupabaseServiceKey
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
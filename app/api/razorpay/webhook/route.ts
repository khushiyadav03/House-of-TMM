import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);
const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature') as string;

    const generatedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (generatedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const { error } = await supabase
        .from('magazine_purchases')
        .update({
          payment_status: 'completed',
          razorpay_payment_id: payment.id,
          razorpay_order_id: payment.order_id,
        })
        .eq('razorpay_order_id', payment.order_id);

      if (error) throw error;

      // Log purchase to analytics
      const { data: purchase, error: fetchError } = await supabase
        .from('magazine_purchases')
        .select('magazine_id')
        .eq('razorpay_order_id', payment.order_id)
        .single();

      if (fetchError) throw fetchError;

      if (purchase) {
        const { error: analyticsError } = await supabase
          .from('analytics')
          .insert({
            content_type: 'magazine',
            content_id: purchase.magazine_id,
            event_type: 'purchase',
            event_data: {
              amount: payment.amount / 100,
              currency: payment.currency,
              user_email: payment.email
            }
          });

        if (analyticsError) throw analyticsError;
      }
    } else if (event.event === 'refund.created') {
      const refund = event.payload.refund.entity;
      const { error } = await supabase
        .from('magazine_purchases')
        .update({ refund_status: 'refunded' })
        .eq('razorpay_payment_id', refund.payment_id);

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
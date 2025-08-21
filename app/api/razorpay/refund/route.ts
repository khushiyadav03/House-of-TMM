/**
 * @file app/api/razorpay/refund/route.ts
 * @description API route to process refunds for magazine purchases.
 * This endpoint handles refund requests and updates the database accordingly.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
const Razorpay = require('razorpay')

// Initialize Supabase client with service role
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Initialize Razorpay function
function getRazorpayInstance() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { purchaseId, reason, amount } = await request.json()

    if (!purchaseId) {
      return NextResponse.json({ error: 'Purchase ID is required' }, { status: 400 })
    }

    // Fetch the purchase record
    const supabaseAdmin = getSupabaseAdmin()
    const { data: purchase, error: fetchError } = await supabaseAdmin
      .from('magazine_purchases')
      .select('*')
      .eq('id', purchaseId)
      .single()

    if (fetchError || !purchase) {
      return NextResponse.json({ error: 'Purchase not found' }, { status: 404 })
    }

    if (purchase.payment_status !== 'completed') {
      return NextResponse.json({ error: 'Cannot refund incomplete payment' }, { status: 400 })
    }

    if (purchase.refund_status === 'completed') {
      return NextResponse.json({ error: 'Refund already processed' }, { status: 400 })
    }

    // Validate that we have a payment ID to refund
    if (!purchase.razorpay_payment_id) {
      return NextResponse.json({ error: 'No Razorpay payment ID found for this purchase' }, { status: 400 })
    }

    // Calculate refund amount (use provided amount or full amount)
    const refundAmount = amount || (purchase.amount * 100) // Convert to paise

    try {
      // Create refund in Razorpay
      const razorpay = getRazorpayInstance()
      const refund = await razorpay.payments.refund(purchase.razorpay_payment_id, {
        amount: refundAmount,
        notes: {
          reason: reason || 'Customer request',
          purchase_id: purchaseId.toString(),
        },
      })

      // Update purchase record with refund information
      const { error: updateError } = await supabaseAdmin
        .from('magazine_purchases')
        .update({
          refund_status: 'processing',
          updated_at: new Date().toISOString(),
        })
        .eq('id', purchaseId)

      if (updateError) {
        console.error('Database update error:', updateError)
        return NextResponse.json({ error: 'Failed to update refund status' }, { status: 500 })
      }

      // Revoke magazine access
      const { error: accessError } = await supabaseAdmin
        .from('magazine_access')
        .update({
          is_active: false,
          updated_at: new Date().toISOString(),
        })
        .eq('purchase_id', purchaseId)

      if (accessError) {
        console.error('Access revocation error:', accessError)
        // Continue anyway as refund is more important
      }

      return NextResponse.json({
        success: true,
        refund_id: refund.id,
        status: refund.status,
        amount: (refund.amount || 0) / 100, // Convert back to rupees
      })
    } catch (razorpayError: any) {
      console.error('Razorpay refund error:', razorpayError)

      // Update refund status to failed
      await supabaseAdmin
        .from('magazine_purchases')
        .update({
          refund_status: 'failed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', purchaseId)

      return NextResponse.json(
        { error: `Refund failed: ${razorpayError.error?.description || razorpayError.message}` },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Refund API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const purchaseId = searchParams.get('purchaseId')

    if (!purchaseId) {
      return NextResponse.json({ error: 'Purchase ID is required' }, { status: 400 })
    }

    // Fetch refund status
    const supabaseAdmin = getSupabaseAdmin()
    const { data: purchase, error } = await supabaseAdmin
      .from('magazine_purchases')
      .select('refund_status, amount, razorpay_payment_id')
      .eq('id', purchaseId)
      .single()

    if (error || !purchase) {
      return NextResponse.json({ error: 'Purchase not found' }, { status: 404 })
    }

    // If there's a payment ID, try to fetch refund details from Razorpay
    let refundDetails: any[] = []
    if (purchase.razorpay_payment_id) {
      try {
        const razorpay = getRazorpayInstance()
        const refunds = await razorpay.payments.fetchMultipleRefund(purchase.razorpay_payment_id)
        refundDetails = refunds.items || []
      } catch (razorpayError) {
        console.error('Error fetching refund details:', razorpayError)
      }
    }

    return NextResponse.json({
      refund_status: purchase.refund_status,
      refund_details: refundDetails,
    })
  } catch (error) {
    console.error('Refund status API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

interface PaymentTestProps {
  onClose?: () => void
}

export default function PaymentTest({ onClose }: PaymentTestProps) {
  const [amount, setAmount] = useState('500')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const testPayment = async () => {
    if (!email || !amount) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and amount",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Step 1: Create order
      const orderResponse = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify({
          magazineId: 1, // Test magazine ID
          amount: parseFloat(amount) * 100, // Convert to paise
        }),
      })

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json()
        throw new Error(errorData.error || 'Failed to create order')
      }

      const orderData = await orderResponse.json()

      // Step 2: Initialize Razorpay
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: parseFloat(amount) * 100,
          currency: 'INR',
          name: 'TMM India - Test',
          description: 'Test Payment',
          order_id: orderData.id,
          handler: async function (response: any) {
            try {
              // Step 3: Verify payment
              const verifyResponse = await fetch('/api/razorpay/verify', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies for authentication
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  magazineId: 1,
                }),
              })

              const verifyData = await verifyResponse.json()

              if (verifyResponse.ok && verifyData.success) {
                toast({
                  title: "Payment Successful!",
                  description: "Test payment completed successfully",
                  variant: "default",
                })
              } else {
                throw new Error('Payment verification failed')
              }
            } catch (error) {
              toast({
                title: "Verification Failed",
                description: (error as Error).message,
                variant: "destructive",
              })
            }
          },
          prefill: {
            email: email,
          },
          theme: {
            color: '#000000',
          },
          modal: {
            ondismiss: function() {
              setLoading(false)
            }
          }
        }

        const razorpay = new (window as any).Razorpay(options)
        razorpay.open()
      } else {
        throw new Error('Razorpay script not loaded')
      }
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: (error as Error).message,
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Test Razorpay Payment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="test@example.com"
          />
        </div>
        <div>
          <Label htmlFor="amount">Amount (INR)</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="500"
          />
        </div>
        <Button 
          onClick={testPayment} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Processing...' : `Test Payment ₹${amount}`}
        </Button>
        {onClose && (
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full"
          >
            Close
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
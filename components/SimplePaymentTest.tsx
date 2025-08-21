"use client"

import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

export default function SimplePaymentTest() {
  const [email, setEmail] = useState('test@example.com')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const testPayment = async () => {
    setLoading(true)
    setStatus('Starting payment test...')

    try {
      // Step 1: Test order creation
      setStatus('Creating order...')
      const orderResponse = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          magazineId: 1,
          amount: 50000,
          userEmail: email
        })
      })

      if (!orderResponse.ok) {
        throw new Error(`Order creation failed: ${orderResponse.status}`)
      }

      const orderData = await orderResponse.json()
      setStatus(`Order created: ${orderData.id}`)

      // Step 2: Check if it's a mock order
      if (orderData.id.startsWith('order_mock_')) {
        setStatus('Mock order detected, simulating payment...')
        
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Step 3: Test verification
        setStatus('Verifying payment...')
        const verifyResponse = await fetch('/api/razorpay/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            razorpay_order_id: orderData.id,
            razorpay_payment_id: `pay_mock_${Date.now()}`,
            razorpay_signature: 'mock_signature',
            magazineId: 1,
            userEmail: email
          })
        })

        if (!verifyResponse.ok) {
          throw new Error(`Verification failed: ${verifyResponse.status}`)
        }

        const verifyData = await verifyResponse.json()
        
        if (verifyData.success) {
          setStatus('✅ Payment test completed successfully!')
        } else {
          setStatus('❌ Payment verification failed')
        }
      } else {
        setStatus('Real Razorpay order created - would open payment gateway')
      }

    } catch (error) {
      setStatus(`❌ Error: ${error}`)
      console.error('Payment test error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Simple Payment Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="test@example.com"
          />
        </div>
        
        <Button 
          onClick={testPayment}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Testing...' : 'Test Payment Flow'}
        </Button>

        {status && (
          <div className="p-3 bg-gray-100 rounded text-sm">
            <strong>Status:</strong> {status}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
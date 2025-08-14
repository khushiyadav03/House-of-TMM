"use client"

import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

export default function PaymentDiagnostic() {
  const [results, setResults] = useState<any[]>([])
  const [testing, setTesting] = useState(false)

  const addResult = (test: string, status: 'success' | 'error' | 'info', message: string, data?: any) => {
    setResults(prev => [...prev, { test, status, message, data, timestamp: new Date().toISOString() }])
  }

  const runDiagnostics = async () => {
    setTesting(true)
    setResults([])

    // Test 1: Environment Variables
    addResult('Environment Variables', 'info', 'Checking environment variables...')
    const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    if (razorpayKeyId) {
      addResult('Environment Variables', 'success', `Razorpay Key ID: ${razorpayKeyId}`)
    } else {
      addResult('Environment Variables', 'error', 'NEXT_PUBLIC_RAZORPAY_KEY_ID not found')
    }

    // Test 2: Razorpay Script Loading
    addResult('Razorpay Script', 'info', 'Checking Razorpay script...')
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      addResult('Razorpay Script', 'success', 'Razorpay script is loaded')
    } else {
      addResult('Razorpay Script', 'error', 'Razorpay script not loaded')
      
      // Try to load it
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      document.body.appendChild(script)
      
      script.onload = () => {
        addResult('Razorpay Script', 'success', 'Razorpay script loaded successfully')
      }
      script.onerror = () => {
        addResult('Razorpay Script', 'error', 'Failed to load Razorpay script')
      }
    }

    // Test 3: API Connectivity
    addResult('API Test', 'info', 'Testing order creation API...')
    try {
      const response = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          magazineId: 1,
          amount: 50000,
          userEmail: 'test@example.com'
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        addResult('API Test', 'success', 'Order creation API working', data)
      } else {
        addResult('API Test', 'error', `API Error: ${response.status}`, data)
      }
    } catch (error) {
      addResult('API Test', 'error', `Network Error: ${error}`)
    }

    // Test 4: Verify API
    addResult('Verify API', 'info', 'Testing payment verification API...')
    try {
      const response = await fetch('/api/razorpay/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_order_id: 'order_mock_test',
          razorpay_payment_id: 'pay_mock_test',
          razorpay_signature: 'mock_signature',
          magazineId: 1,
          userEmail: 'test@example.com'
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        addResult('Verify API', 'success', 'Verification API working', data)
      } else {
        addResult('Verify API', 'error', `Verify API Error: ${response.status}`, data)
      }
    } catch (error) {
      addResult('Verify API', 'error', `Verify Network Error: ${error}`)
    }

    setTesting(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600'
      case 'error': return 'text-red-600'
      case 'info': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'info': return 'ℹ️'
      default: return '⚪'
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Payment System Diagnostics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={runDiagnostics} 
            disabled={testing}
            className="w-full"
          >
            {testing ? 'Running Diagnostics...' : 'Run Payment Diagnostics'}
          </Button>

          {results.length > 0 && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div key={index} className="border rounded p-3">
                  <div className="flex items-center space-x-2">
                    <span>{getStatusIcon(result.status)}</span>
                    <span className="font-medium">{result.test}</span>
                    <span className={getStatusColor(result.status)}>
                      {result.message}
                    </span>
                  </div>
                  {result.data && (
                    <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
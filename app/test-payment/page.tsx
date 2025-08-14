"use client"

import { useEffect, useState } from 'react'
import PaymentTest from '@/components/PaymentTest'
import PaymentDiagnostic from '@/components/PaymentDiagnostic'
import SimplePaymentTest from '@/components/SimplePaymentTest'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface HealthCheck {
  name: string
  status: 'success' | 'error' | 'warning'
  message: string
}

export default function TestPaymentPage() {
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([])
  const [scriptLoaded, setScriptLoaded] = useState(false)

  useEffect(() => {
    performHealthChecks()
    loadRazorpayScript()
  }, [])

  const performHealthChecks = () => {
    const checks: HealthCheck[] = []

    // Check environment variables
    if (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      checks.push({
        name: 'Razorpay Key ID',
        status: 'success',
        message: 'Key ID is configured'
      })
    } else {
      checks.push({
        name: 'Razorpay Key ID',
        status: 'error',
        message: 'NEXT_PUBLIC_RAZORPAY_KEY_ID not found'
      })
    }

    // Check Supabase URL
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      checks.push({
        name: 'Supabase URL',
        status: 'success',
        message: 'Supabase URL is configured'
      })
    } else {
      checks.push({
        name: 'Supabase URL',
        status: 'error',
        message: 'NEXT_PUBLIC_SUPABASE_URL not found'
      })
    }

    // Check base URL
    if (process.env.NEXT_PUBLIC_BASE_URL) {
      checks.push({
        name: 'Base URL',
        status: 'success',
        message: `Base URL: ${process.env.NEXT_PUBLIC_BASE_URL}`
      })
    } else {
      checks.push({
        name: 'Base URL',
        status: 'warning',
        message: 'NEXT_PUBLIC_BASE_URL not set, using default'
      })
    }

    setHealthChecks(checks)
  }

  const loadRazorpayScript = () => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      setScriptLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => setScriptLoaded(true)
    script.onerror = () => setScriptLoaded(false)
    document.body.appendChild(script)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">OK</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      case 'warning':
        return <Badge variant="secondary">Warning</Badge>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Razorpay Integration Test
          </h1>
          <p className="text-gray-600">
            Test the payment integration and verify system health
          </p>
        </div>

        {/* Health Checks */}
        <Card>
          <CardHeader>
            <CardTitle>System Health Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {healthChecks.map((check, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(check.status)}
                    <div>
                      <p className="font-medium">{check.name}</p>
                      <p className="text-sm text-gray-600">{check.message}</p>
                    </div>
                  </div>
                  {getStatusBadge(check.status)}
                </div>
              ))}
              
              {/* Razorpay Script Status */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(scriptLoaded ? 'success' : 'error')}
                  <div>
                    <p className="font-medium">Razorpay Script</p>
                    <p className="text-sm text-gray-600">
                      {scriptLoaded ? 'Razorpay script loaded successfully' : 'Failed to load Razorpay script'}
                    </p>
                  </div>
                </div>
                {getStatusBadge(scriptLoaded ? 'success' : 'error')}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Simple Payment Test */}
        <div className="flex justify-center mb-8">
          <SimplePaymentTest />
        </div>

        {/* Payment Diagnostics */}
        <PaymentDiagnostic />

        {/* Payment Test */}
        <div className="flex justify-center">
          <PaymentTest />
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Test Instructions</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <ol className="list-decimal list-inside space-y-2">
              <li>Ensure all health checks show "OK" status</li>
              <li>Enter a test email address</li>
              <li>Set the amount (default: ₹500)</li>
              <li>Click "Test Payment" to open Razorpay checkout</li>
              <li>Use test card details:
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Card: 4111 1111 1111 1111</li>
                  <li>Expiry: Any future date</li>
                  <li>CVV: Any 3 digits</li>
                </ul>
              </li>
              <li>Complete the payment to test the full flow</li>
            </ol>
            
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This is a test environment. No real money will be charged.
                Make sure you're using Razorpay test keys.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
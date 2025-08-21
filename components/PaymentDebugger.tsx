"use client"

import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Alert, AlertDescription } from './ui/alert'
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

export default function PaymentDebugger() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runDebug = async () => {
    setLoading(true)
    const results: any = {}

    try {
      // Test 1: Environment Variables
      results.envVars = {
        hasPublicRazorpayKey: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        publicKeyLength: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.length || 0,
        publicKeyPrefix: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.substring(0, 8) || 'Not set'
      }

      // Test 2: Razorpay Configuration API
      try {
        const configResponse = await fetch('/api/test-razorpay-config')
        results.razorpayConfig = await configResponse.json()
      } catch (error) {
        results.razorpayConfig = { error: String(error) }
      }

      // Test 3: Magazine API
      try {
        const magazineResponse = await fetch('/api/magazines/1')
        if (magazineResponse.ok) {
          results.magazineData = await magazineResponse.json()
        } else {
          results.magazineData = { error: `HTTP ${magazineResponse.status}` }
        }
      } catch (error) {
        results.magazineData = { error: String(error) }
      }

      // Test 4: Order Creation (with test data)
      try {
        const orderResponse = await fetch('/api/razorpay/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            magazineId: 1,
            userEmail: 'test@example.com',
            amount: 10000 // ₹100 in paise
          })
        })
        
        if (orderResponse.ok) {
          results.orderCreation = await orderResponse.json()
        } else {
          const errorData = await orderResponse.json()
          results.orderCreation = { 
            error: `HTTP ${orderResponse.status}`,
            details: errorData
          }
        }
      } catch (error) {
        results.orderCreation = { error: String(error) }
      }

      setDebugInfo(results)
    } catch (error) {
      setDebugInfo({ globalError: String(error) })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (hasError: boolean) => {
    if (hasError) return <XCircle className="h-4 w-4 text-red-500" />
    return <CheckCircle className="h-4 w-4 text-green-500" />
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Payment System Debugger</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runDebug} disabled={loading} className="w-full">
          {loading ? 'Running Debug...' : 'Debug Payment System'}
        </Button>

        {debugInfo && (
          <div className="space-y-4">
            {/* Environment Variables */}
            <div className="border rounded p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                {getStatusIcon(!debugInfo.envVars?.hasPublicRazorpayKey)}
                Frontend Environment Variables
              </h3>
              <div className="text-sm space-y-1">
                <p>Public Razorpay Key: {debugInfo.envVars?.hasPublicRazorpayKey ? '✅ Set' : '❌ Missing'}</p>
                <p>Key Length: {debugInfo.envVars?.publicKeyLength}</p>
                <p>Key Prefix: {debugInfo.envVars?.publicKeyPrefix}</p>
              </div>
            </div>

            {/* Razorpay Configuration */}
            <div className="border rounded p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                {getStatusIcon(!debugInfo.razorpayConfig?.allConfigured)}
                Backend Razorpay Configuration
              </h3>
              {debugInfo.razorpayConfig?.error ? (
                <Alert variant="destructive">
                  <AlertDescription>{debugInfo.razorpayConfig.error}</AlertDescription>
                </Alert>
              ) : (
                <div className="text-sm space-y-1">
                  <p>All Configured: {debugInfo.razorpayConfig?.allConfigured ? '✅ Yes' : '❌ No'}</p>
                  <p>Razorpay Key ID: {debugInfo.razorpayConfig?.config?.hasRazorpayKeyId ? '✅ Set' : '❌ Missing'}</p>
                  <p>Razorpay Secret: {debugInfo.razorpayConfig?.config?.hasRazorpayKeySecret ? '✅ Set' : '❌ Missing'}</p>
                  <p>Public Key ID: {debugInfo.razorpayConfig?.config?.hasPublicRazorpayKeyId ? '✅ Set' : '❌ Missing'}</p>
                  <p>Supabase URL: {debugInfo.razorpayConfig?.config?.hasSupabaseUrl ? '✅ Set' : '❌ Missing'}</p>
                  <p>Supabase Service Key: {debugInfo.razorpayConfig?.config?.hasSupabaseServiceKey ? '✅ Set' : '❌ Missing'}</p>
                </div>
              )}
            </div>

            {/* Magazine Data */}
            <div className="border rounded p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                {getStatusIcon(!!debugInfo.magazineData?.error)}
                Magazine Data
              </h3>
              {debugInfo.magazineData?.error ? (
                <Alert variant="destructive">
                  <AlertDescription>{debugInfo.magazineData.error}</AlertDescription>
                </Alert>
              ) : (
                <div className="text-sm">
                  <p>Magazine ID: {debugInfo.magazineData?.id}</p>
                  <p>Title: {debugInfo.magazineData?.title}</p>
                  <p>Price: ₹{debugInfo.magazineData?.price}</p>
                </div>
              )}
            </div>

            {/* Order Creation */}
            <div className="border rounded p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                {getStatusIcon(!!debugInfo.orderCreation?.error)}
                Order Creation Test
              </h3>
              {debugInfo.orderCreation?.error ? (
                <div className="space-y-2">
                  <Alert variant="destructive">
                    <AlertDescription>{debugInfo.orderCreation.error}</AlertDescription>
                  </Alert>
                  {debugInfo.orderCreation?.details && (
                    <details className="text-xs">
                      <summary className="cursor-pointer">Error Details</summary>
                      <pre className="mt-2 p-2 bg-gray-100 rounded overflow-x-auto">
                        {JSON.stringify(debugInfo.orderCreation.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ) : (
                <div className="text-sm">
                  <p>Order ID: {debugInfo.orderCreation?.id}</p>
                  <p>Amount: ₹{debugInfo.orderCreation?.amount / 100}</p>
                  <p>Currency: {debugInfo.orderCreation?.currency}</p>
                  <p>Status: {debugInfo.orderCreation?.status}</p>
                </div>
              )}
            </div>

            {/* Raw Debug Data */}
            <details className="border rounded p-4">
              <summary className="font-semibold cursor-pointer">Raw Debug Data</summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
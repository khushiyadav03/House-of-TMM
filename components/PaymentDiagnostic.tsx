"use client"

import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { CheckCircle, XCircle, AlertCircle, Loader2, CreditCard } from 'lucide-react'

interface DiagnosticResult {
  test: string
  status: 'success' | 'error' | 'info' | 'warning' | 'pending'
  message: string
  data?: any
  timestamp: string
}

export default function PaymentDiagnostic() {
  const [results, setResults] = useState<DiagnosticResult[]>([])
  const [testing, setTesting] = useState(false)
  const [currentTest, setCurrentTest] = useState<string>('')

  const addResult = (test: string, status: DiagnosticResult['status'], message: string, data?: any) => {
    setResults(prev => [...prev, { test, status, message, data, timestamp: new Date().toLocaleTimeString() }])
  }

  const updateLastResult = (status: DiagnosticResult['status'], message: string, data?: any) => {
    setResults(prev => {
      const newResults = [...prev]
      if (newResults.length > 0) {
        newResults[newResults.length - 1] = {
          ...newResults[newResults.length - 1],
          status,
          message,
          data,
          timestamp: new Date().toLocaleTimeString()
        }
      }
      return newResults
    })
  }

  const runDiagnostics = async () => {
    setTesting(true)
    setResults([])

    // Test 1: Environment Variables
    setCurrentTest('Checking environment variables...')
    addResult('Environment Variables', 'pending', 'Checking configuration...')
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    const keyIdLength = razorpayKeyId?.length || 0
    
    if (razorpayKeyId && keyIdLength > 10) {
      updateLastResult('success', `Razorpay Key ID configured (${keyIdLength} chars)`, { keyId: razorpayKeyId })
    } else if (razorpayKeyId) {
      updateLastResult('warning', `Razorpay Key ID present but seems invalid (${keyIdLength} chars)`, { keyId: razorpayKeyId })
    } else {
      updateLastResult('error', 'NEXT_PUBLIC_RAZORPAY_KEY_ID is missing')
    }

    // Test 2: Razorpay Script Loading
    setCurrentTest('Testing Razorpay script loading...')
    addResult('Razorpay Script', 'pending', 'Loading payment script...')
    
    try {
      let scriptExists = document.querySelector('script[src*="razorpay"]')
      
      if (!scriptExists) {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        document.head.appendChild(script)
        
        await new Promise((resolve, reject) => {
          script.onload = resolve
          script.onerror = reject
          setTimeout(reject, 5000) // 5 second timeout
        })
      }
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const razorpayAvailable = !!(window as any).Razorpay
      if (razorpayAvailable) {
        updateLastResult('success', 'Razorpay script loaded and available')
      } else {
        updateLastResult('error', 'Razorpay script loaded but object not available')
      }
    } catch (error) {
      updateLastResult('error', 'Failed to load Razorpay script', { error: String(error) })
    }

    // Test 3: Database Connection
    setCurrentTest('Testing database connection...')
    addResult('Database Connection', 'pending', 'Connecting to database...')
    
    try {
      const dbResponse = await fetch('/api/test-db', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (dbResponse.ok) {
        const dbData = await dbResponse.json()
        updateLastResult('success', 'Database connection successful', dbData)
      } else {
        const errorText = await dbResponse.text()
        updateLastResult('error', `Database connection failed (${dbResponse.status})`, { error: errorText })
      }
    } catch (error) {
      updateLastResult('error', 'Database connection error', { error: String(error) })
    }

    // Test 4: Order Creation API
    setCurrentTest('Testing order creation...')
    addResult('Order Creation API', 'pending', 'Testing order creation endpoint...')
    
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
      
      const orderData = await orderResponse.json()
      
      if (orderResponse.ok) {
        updateLastResult('success', `Order created successfully (ID: ${orderData.id})`, orderData)
        
        // Test 5: Verification API (only if order creation succeeded)
        setCurrentTest('Testing payment verification...')
        addResult('Payment Verification', 'pending', 'Testing verification endpoint...')
        
        try {
          const verifyResponse = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: orderData.id,
              razorpay_payment_id: 'pay_test_123',
              razorpay_signature: 'test_signature',
              magazineId: 1,
              userEmail: 'test@example.com'
            })
          })
          
          const verifyData = await verifyResponse.json()
          
          if (verifyResponse.status === 400 && verifyData.error?.includes('Invalid payment signature')) {
            updateLastResult('success', 'Verification endpoint working (correctly rejected test signature)', verifyData)
          } else if (verifyResponse.ok) {
            updateLastResult('warning', 'Verification endpoint accepted test data (potential security issue)', verifyData)
          } else {
            updateLastResult('error', `Verification failed (${verifyResponse.status})`, verifyData)
          }
        } catch (error) {
          updateLastResult('error', 'Verification endpoint error', { error: String(error) })
        }
      } else {
        updateLastResult('error', `Order creation failed (${orderResponse.status})`, orderData)
      }
    } catch (error) {
      updateLastResult('error', 'Order creation error', { error: String(error) })
    }

    // Test 6: Guest Order API
    setCurrentTest('Testing guest order creation...')
    addResult('Guest Order API', 'pending', 'Testing guest order endpoint...')
    
    try {
      const guestOrderResponse = await fetch('/api/razorpay/guest-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          magazineId: 1,
          amount: 10000,
          userDetails: {
            name: 'Test User',
            email: 'test@example.com',
            phone: '+919876543210'
          }
        })
      })
      
      const guestOrderData = await guestOrderResponse.json()
      
      if (guestOrderResponse.ok) {
        updateLastResult('success', `Guest order created successfully (ID: ${guestOrderData.id})`, guestOrderData)
      } else {
        updateLastResult('error', `Guest order creation failed (${guestOrderResponse.status})`, guestOrderData)
      }
    } catch (error) {
      updateLastResult('error', 'Guest order creation error', { error: String(error) })
    }

    // Test 7: Razorpay Configuration
    setCurrentTest('Testing Razorpay configuration...')
    addResult('Razorpay Configuration', 'pending', 'Checking environment variables...')
    
    try {
      const configResponse = await fetch('/api/test-razorpay-config')
      
      if (configResponse.ok) {
        const configData = await configResponse.json()
        if (configData.success && configData.allConfigured) {
          updateLastResult('success', 'All Razorpay environment variables configured', configData.config)
        } else {
          updateLastResult('error', 'Razorpay configuration incomplete', configData.config)
        }
      } else {
        updateLastResult('error', `Configuration check failed (${configResponse.status})`)
      }
    } catch (error) {
      updateLastResult('error', 'Configuration check error', { error: String(error) })
    }

    // Test 8: Magazine Data Validation
    setCurrentTest('Testing magazine data...')
    addResult('Magazine Data', 'pending', 'Validating magazine information...')
    
    try {
      const magazineResponse = await fetch('/api/magazines/1')
      
      if (magazineResponse.ok) {
        const magazineData = await magazineResponse.json()
        if (magazineData && magazineData.price) {
          updateLastResult('success', `Magazine data valid (Price: ₹${magazineData.price})`, magazineData)
        } else {
          updateLastResult('warning', 'Magazine data incomplete', magazineData)
        }
      } else {
        updateLastResult('error', `Magazine API failed (${magazineResponse.status})`)
      }
    } catch (error) {
      updateLastResult('error', 'Magazine data error', { error: String(error) })
    }

    setCurrentTest('')
    setTesting(false)
  }

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'pending':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case 'info':
        return <AlertCircle className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusBadge = (status: DiagnosticResult['status']) => {
    const variants = {
      success: 'default',
      warning: 'secondary',
      error: 'destructive',
      pending: 'outline',
      info: 'outline'
    } as const

    return (
      <Badge variant={variants[status]} className="ml-2">
        {status.toUpperCase()}
      </Badge>
    )
  }

  const clearResults = () => {
    setResults([])
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment System Diagnostics
        </CardTitle>
        {testing && currentTest && (
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {currentTest}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={runDiagnostics} disabled={testing}>
            {testing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Running Diagnostics...
              </>
            ) : (
              'Run Full Diagnostics'
            )}
          </Button>
          <Button variant="outline" onClick={clearResults} disabled={testing}>
            Clear Results
          </Button>
        </div>
        
        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Diagnostic Results:</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.status)}
                      <span className="font-medium">{result.test}</span>
                      {getStatusBadge(result.status)}
                    </div>
                    <span className="text-xs text-gray-500">{result.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{result.message}</p>
                  {result.data && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-gray-600 hover:text-gray-800 mb-2">
                        Show Details
                      </summary>
                      <pre className="p-2 bg-gray-100 rounded text-xs overflow-x-auto border">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
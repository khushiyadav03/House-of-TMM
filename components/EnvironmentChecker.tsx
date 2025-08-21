"use client"

import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Alert, AlertDescription } from './ui/alert'
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

export default function EnvironmentChecker() {
  const checks = [
    {
      name: 'Razorpay Public Key',
      value: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      required: true,
      type: 'public'
    },
    {
      name: 'Supabase URL',
      value: process.env.NEXT_PUBLIC_SUPABASE_URL,
      required: true,
      type: 'public'
    }
  ]

  const getIcon = (hasValue: boolean, required: boolean) => {
    if (required && !hasValue) return <XCircle className="h-4 w-4 text-red-500" />
    if (hasValue) return <CheckCircle className="h-4 w-4 text-green-500" />
    return <AlertTriangle className="h-4 w-4 text-yellow-500" />
  }

  const allRequired = checks.filter(c => c.required).every(c => c.value)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getIcon(allRequired, true)}
          Environment Variables
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!allRequired && (
          <Alert variant="destructive">
            <AlertDescription>
              Some required environment variables are missing. Please check your .env.local file.
            </AlertDescription>
          </Alert>
        )}
        
        {checks.map((check, index) => (
          <div key={index} className="flex items-center justify-between p-2 border rounded">
            <div className="flex items-center gap-2">
              {getIcon(!!check.value, check.required)}
              <span className="font-medium">{check.name}</span>
              {check.required && <span className="text-red-500 text-xs">*</span>}
            </div>
            <div className="text-sm text-gray-600">
              {check.value ? (
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                  {check.value.substring(0, 20)}...
                </span>
              ) : (
                <span className="text-red-500">Not set</span>
              )}
            </div>
          </div>
        ))}

        <div className="mt-4 p-3 bg-blue-50 rounded">
          <h4 className="font-semibold text-blue-900 mb-2">Quick Setup:</h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Copy .env.local.example to .env.local</li>
            <li>2. Get your Razorpay keys from dashboard.razorpay.com</li>
            <li>3. Get your Supabase credentials from supabase.com</li>
            <li>4. Restart your development server</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
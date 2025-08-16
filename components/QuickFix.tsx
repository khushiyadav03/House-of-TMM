"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Alert, AlertDescription } from './ui/alert'
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react'

export default function QuickFix() {
  const [issues, setIssues] = useState<any[]>([])
  const [checking, setChecking] = useState(false)

  const checkIssues = async () => {
    setChecking(true)
    const foundIssues = []

    // Check 1: Environment Variables
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      foundIssues.push({
        type: 'error',
        title: 'Missing Razorpay Public Key',
        description: 'NEXT_PUBLIC_RAZORPAY_KEY_ID is not set',
        fix: 'Add NEXT_PUBLIC_RAZORPAY_KEY_ID to your .env.local file'
      })
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      foundIssues.push({
        type: 'error',
        title: 'Missing Supabase URL',
        description: 'NEXT_PUBLIC_SUPABASE_URL is not set',
        fix: 'Add NEXT_PUBLIC_SUPABASE_URL to your .env.local file'
      })
    }

    // Check 2: Backend Configuration
    try {
      const configResponse = await fetch('/api/test-razorpay-config')
      if (configResponse.ok) {
        const configData = await configResponse.json()
        if (!configData.allConfigured) {
          foundIssues.push({
            type: 'error',
            title: 'Backend Configuration Incomplete',
            description: 'Some backend environment variables are missing',
            fix: 'Check RAZORPAY_KEY_SECRET and SUPABASE_SERVICE_ROLE_KEY in .env.local'
          })
        }
      } else {
        foundIssues.push({
          type: 'error',
          title: 'Configuration API Failed',
          description: 'Cannot check backend configuration',
          fix: 'Ensure your server is running and API routes are accessible'
        })
      }
    } catch (error) {
      foundIssues.push({
        type: 'error',
        title: 'API Connection Failed',
        description: 'Cannot connect to configuration API',
        fix: 'Check if your development server is running'
      })
    }

    // Check 2.5: Razorpay Authentication
    try {
      const authResponse = await fetch('/api/test-razorpay-auth')
      if (authResponse.ok) {
        const authData = await authResponse.json()
        if (!authData.success) {
          foundIssues.push({
            type: 'error',
            title: 'Razorpay Authentication Failed',
            description: authData.details || 'Invalid Razorpay credentials',
            fix: 'Verify your Razorpay API keys are correct and active'
          })
        }
      } else {
        const errorData = await authResponse.json()
        foundIssues.push({
          type: 'error',
          title: 'Razorpay Authentication Failed',
          description: errorData.details || 'Cannot authenticate with Razorpay',
          fix: 'Check your Razorpay API keys and ensure they are valid'
        })
      }
    } catch (error) {
      foundIssues.push({
        type: 'error',
        title: 'Razorpay Connection Failed',
        description: 'Cannot test Razorpay authentication',
        fix: 'Check your internet connection and Razorpay API keys'
      })
    }

    // Check 3: Magazine Data
    try {
      const magazineResponse = await fetch('/api/magazines/1')
      if (!magazineResponse.ok) {
        foundIssues.push({
          type: 'warning',
          title: 'Magazine Data Not Found',
          description: 'Test magazine (ID: 1) not found in database',
          fix: 'Add some test magazines to your database or check database connection'
        })
      }
    } catch (error) {
      foundIssues.push({
        type: 'error',
        title: 'Magazine API Failed',
        description: 'Cannot fetch magazine data',
        fix: 'Check database connection and ensure magazines table exists'
      })
    }

    setIssues(foundIssues)
    setChecking(false)
  }

  useEffect(() => {
    checkIssues()
  }, [])

  const getIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getAlertVariant = (type: string) => {
    return type === 'error' ? 'destructive' : 'default'
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Quick Fix - Payment Issues
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Automatically checking for common payment system issues...
          </p>
          <Button onClick={checkIssues} disabled={checking} size="sm">
            {checking ? 'Checking...' : 'Recheck'}
          </Button>
        </div>

        {issues.length === 0 && !checking && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              No issues found! Your payment system appears to be configured correctly.
            </AlertDescription>
          </Alert>
        )}

        {issues.map((issue, index) => (
          <Alert key={index} variant={getAlertVariant(issue.type)}>
            <div className="flex items-start gap-3">
              {getIcon(issue.type)}
              <div className="flex-1">
                <h4 className="font-semibold">{issue.title}</h4>
                <p className="text-sm mt-1">{issue.description}</p>
                <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                  <strong>Fix:</strong> {issue.fix}
                </div>
              </div>
            </div>
          </Alert>
        ))}

        {issues.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Quick Setup Guide:</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Create a <code>.env.local</code> file in your project root</li>
              <li>Copy the contents from <code>.env.local.example</code></li>
              <li>Get your Razorpay keys from <a href="https://dashboard.razorpay.com/app/keys" target="_blank" className="underline">dashboard.razorpay.com</a></li>
              <li>Get your Supabase credentials from <a href="https://supabase.com" target="_blank" className="underline">supabase.com</a></li>
              <li>Restart your development server: <code>npm run dev</code></li>
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
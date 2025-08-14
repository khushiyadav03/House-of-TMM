"use client"

import { useState, useEffect } from 'react'
import PaymentTest from '@/components/PaymentTest'
import RefundTest from '@/components/RefundTest'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface Purchase {
  id: number
  magazine_id: number
  user_id: string
  amount: number
  payment_status: string
  refund_status: string | null
  purchase_date: string
  payment_id: string
  razorpay_payment_id: string | null
}

export default function AdminTestPaymentsPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const fetchRecentPurchases = async () => {
    setLoading(true)
    try {
      // This would need an admin API endpoint to fetch all purchases
      // For now, we'll show a placeholder
      toast({
        title: "Info",
        description: "Recent purchases would be displayed here in a real admin panel",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch purchases",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const testWebhook = async () => {
    try {
      const testPayload = {
        event: 'payment.captured',
        payload: {
          payment: {
            entity: {
              id: 'pay_test123',
              order_id: 'order_test456',
              amount: 50000,
              currency: 'INR',
              email: 'test@example.com'
            }
          }
        }
      }

      const response = await fetch('/api/razorpay/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': 'test_signature'
        },
        body: JSON.stringify(testPayload)
      })

      if (response.ok) {
        toast({
          title: "Webhook Test",
          description: "Webhook endpoint is accessible (signature verification may fail)",
          variant: "default",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Webhook Test Failed",
          description: error.error || "Unknown error",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Webhook Test Error",
        description: (error as Error).message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment System Admin Panel
          </h1>
          <p className="text-gray-600">
            Test and manage payment integrations
          </p>
        </div>

        <Tabs defaultValue="payment" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="payment">Test Payment</TabsTrigger>
            <TabsTrigger value="refund">Test Refund</TabsTrigger>
            <TabsTrigger value="webhook">Webhook Test</TabsTrigger>
            <TabsTrigger value="purchases">Recent Purchases</TabsTrigger>
          </TabsList>

          <TabsContent value="payment" className="space-y-6">
            <div className="flex justify-center">
              <PaymentTest />
            </div>
          </TabsContent>

          <TabsContent value="refund" className="space-y-6">
            <div className="flex justify-center">
              <RefundTest />
            </div>
          </TabsContent>

          <TabsContent value="webhook" className="space-y-6">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Webhook Testing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Test the webhook endpoint to ensure it's properly configured and accessible.
                </p>
                <Button onClick={testWebhook} className="w-full">
                  Test Webhook Endpoint
                </Button>
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Webhook Configuration</h4>
                  <p className="text-sm text-blue-800">
                    URL: <code>{process.env.NEXT_PUBLIC_BASE_URL}/api/razorpay/webhook</code>
                  </p>
                  <p className="text-sm text-blue-800">
                    Events: payment.captured, refund.created
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="purchases" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Purchases</CardTitle>
                <Button onClick={fetchRecentPurchases} disabled={loading}>
                  {loading ? 'Loading...' : 'Refresh'}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <p>Recent purchases would be displayed here.</p>
                  <p className="text-sm mt-2">
                    This requires implementing an admin API endpoint to fetch all purchases.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* API Endpoints Reference */}
        <Card>
          <CardHeader>
            <CardTitle>API Endpoints Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Payment Endpoints</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">POST</Badge>
                    <code>/api/razorpay/order</code>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">POST</Badge>
                    <code>/api/razorpay/verify</code>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">POST</Badge>
                    <code>/api/razorpay/webhook</code>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Management Endpoints</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center space-x-2">
                    <Badge variant="destructive">POST</Badge>
                    <code>/api/razorpay/refund</code>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default">GET</Badge>
                    <code>/api/magazines/purchases</code>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default">GET</Badge>
                    <code>/api/magazines/[id]/check-purchase</code>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
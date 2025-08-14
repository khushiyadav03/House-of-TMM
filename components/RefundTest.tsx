"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

export default function RefundTest() {
  const [purchaseId, setPurchaseId] = useState('')
  const [reason, setReason] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const processRefund = async () => {
    if (!purchaseId) {
      toast({
        title: "Missing Information",
        description: "Please enter purchase ID",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/razorpay/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          purchaseId: parseInt(purchaseId),
          reason: reason || 'Test refund',
          amount: amount ? parseFloat(amount) * 100 : undefined, // Convert to paise if provided
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "Refund Successful!",
          description: `Refund ID: ${data.refund_id}, Amount: ₹${data.amount}`,
          variant: "default",
        })
        // Reset form
        setPurchaseId('')
        setReason('')
        setAmount('')
      } else {
        throw new Error(data.error || 'Refund failed')
      }
    } catch (error) {
      toast({
        title: "Refund Failed",
        description: (error as Error).message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const checkRefundStatus = async () => {
    if (!purchaseId) {
      toast({
        title: "Missing Information",
        description: "Please enter purchase ID",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/razorpay/refund?purchaseId=${purchaseId}`)
      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Refund Status",
          description: `Status: ${data.refund_status || 'No refund'}, Details: ${data.refund_details?.length || 0} refunds`,
          variant: "default",
        })
      } else {
        throw new Error(data.error || 'Failed to check status')
      }
    } catch (error) {
      toast({
        title: "Status Check Failed",
        description: (error as Error).message,
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Test Refund System</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="purchaseId">Purchase ID</Label>
          <Input
            id="purchaseId"
            type="number"
            value={purchaseId}
            onChange={(e) => setPurchaseId(e.target.value)}
            placeholder="123"
          />
        </div>
        <div>
          <Label htmlFor="reason">Reason (Optional)</Label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Customer request"
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="amount">Partial Amount (Optional)</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Leave empty for full refund"
          />
        </div>
        <div className="space-y-2">
          <Button 
            onClick={processRefund} 
            disabled={loading}
            className="w-full"
            variant="destructive"
          >
            {loading ? 'Processing...' : 'Process Refund'}
          </Button>
          <Button 
            onClick={checkRefundStatus} 
            variant="outline"
            className="w-full"
          >
            Check Refund Status
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
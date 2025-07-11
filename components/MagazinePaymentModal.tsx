"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface Magazine {
  id: number
  title: string
  issue_date: string
  cover_image_url: string
  pdf_url: string
  price: number
}

interface MagazinePaymentModalProps {
  isOpen: boolean
  onClose: () => void
  magazine: Magazine
  onPaymentSuccess: (magazineId: number) => void
}

export default function MagazinePaymentModal({
  isOpen,
  onClose,
  magazine,
  onPaymentSuccess,
}: MagazinePaymentModalProps) {
  const [email, setEmail] = useState("")
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const { toast } = useToast()

  const handlePayment = async () => {
    setPaymentProcessing(true)
    try {
      // Step 1: Create Payment Intent
      const paymentIntentResponse = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: magazine.price * 100, currency: "inr" }), // Amount in paisa, currency INR
      })
      const paymentIntentData = await paymentIntentResponse.json()

      if (!paymentIntentResponse.ok) {
        throw new Error(paymentIntentData.error || "Failed to create payment intent.")
      }

      const { clientSecret } = paymentIntentData

      // Simulate payment confirmation (in a real app, this would involve Stripe.js or similar)
      // For now, we'll directly call the confirm-payment API route
      const confirmPaymentResponse = await fetch("/api/confirm-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentIntentId: paymentIntentData.id,
          email,
          magazineId: magazine.id,
        }),
      })

      const confirmPaymentData = await confirmPaymentResponse.json()

      if (!confirmPaymentResponse.ok) {
        throw new Error(confirmPaymentData.error || "Payment confirmation failed.")
      }

      toast({
        title: "Payment Successful!",
        description: `You have successfully purchased ${magazine.title}.`,
        variant: "default",
      })
      onPaymentSuccess(magazine.id)
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment.",
        variant: "destructive",
      })
    } finally {
      setPaymentProcessing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Purchase {magazine.title}</DialogTitle>
          <DialogDescription>Complete your purchase for ₹{magazine.price.toFixed(2)}.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
              placeholder="your@example.com"
            />
          </div>
          {/* In a real application, you would integrate a payment gateway UI here (e.g., Stripe Elements) */}
          <div className="text-center text-sm text-gray-500">
            {/* Placeholder for card details input */}
            <p>Card details input would go here in a real integration.</p>
            <p>For demonstration, clicking "Pay Now" will simulate a successful payment.</p>
          </div>
        </div>
        <Button onClick={handlePayment} disabled={paymentProcessing || !email}>
          {paymentProcessing ? "Processing..." : `Pay Now ₹${magazine.price.toFixed(2)}`}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

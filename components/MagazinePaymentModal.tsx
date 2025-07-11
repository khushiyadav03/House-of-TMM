"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface Magazine {
  id: number
  title: string
  price: number
}

interface MagazinePaymentModalProps {
  isOpen: boolean
  onClose: () => void
  magazine: Magazine
  onPaymentSuccess: () => void
}

export default function MagazinePaymentModal({
  isOpen,
  onClose,
  magazine,
  onPaymentSuccess,
}: MagazinePaymentModalProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvc, setCvc] = useState("")
  const [nameOnCard, setNameOnCard] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handlePayment = async () => {
    setLoading(true)
    try {
      // Simulate payment processing
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: magazine.price * 100, // Amount in smallest currency unit (e.g., paise for INR)
          currency: "inr", // Changed currency to INR
          magazineId: magazine.id,
        }),
      })

      const { clientSecret, error: paymentIntentError } = await response.json()

      if (paymentIntentError) {
        throw new Error(paymentIntentError)
      }

      // Simulate confirming payment (in a real app, you'd use Stripe.js confirmCardPayment)
      const confirmResponse = await fetch("/api/confirm-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentIntentId: "pi_mock_success_123", // Mock payment intent ID
          cardNumber,
          expiryDate,
          cvc,
          nameOnCard,
        }),
      })

      const { success, error: confirmError } = await confirmResponse.json()

      if (confirmError) {
        throw new Error(confirmError)
      }

      if (success) {
        toast({
          title: "Payment Successful!",
          description: `You have successfully purchased ${magazine.title}.`,
          variant: "default",
        })
        onPaymentSuccess()
      } else {
        toast({
          title: "Payment Failed",
          description: "There was an issue processing your payment. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Payment error:", error)
      toast({
        title: "Payment Error",
        description: error.message || "An unexpected error occurred during payment.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Purchase {magazine.title}</DialogTitle>
          <DialogDescription>Complete your payment for **₹{magazine.price}**.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="**** **** **** ****"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                placeholder="***"
                type="password"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="nameOnCard">Name on Card</Label>
            <Input
              id="nameOnCard"
              placeholder="John Doe"
              value={nameOnCard}
              onChange={(e) => setNameOnCard(e.target.value)}
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handlePayment} disabled={loading}>
            {loading ? "Processing..." : `Pay ₹${magazine.price}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

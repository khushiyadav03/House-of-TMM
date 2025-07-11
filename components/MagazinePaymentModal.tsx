"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

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

export function MagazinePaymentModal({ isOpen, onClose, magazine, onPaymentSuccess }: MagazinePaymentModalProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvc, setCvc] = useState("")
  const [nameOnCard, setNameOnCard] = useState("")
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null)

  const handlePayment = async () => {
    setPaymentStatus("processing")
    setPaymentMessage(null)

    try {
      // Step 1: Create Payment Intent
      const createPaymentIntentResponse = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: magazine.price * 100, magazineId: magazine.id }), // amount in cents
      })

      if (!createPaymentIntentResponse.ok) {
        const errorData = await createPaymentIntentResponse.json()
        throw new Error(errorData.error || "Failed to create payment intent")
      }

      const { clientSecret, paymentIntentId } = await createPaymentIntentResponse.json()

      // Simulate payment confirmation (in a real app, this would involve Stripe.js or similar)
      // For this example, we'll just directly confirm on the server
      const confirmPaymentResponse = await fetch("/api/confirm-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentIntentId,
          paymentMethodDetails: {
            card: {
              number: cardNumber,
              exp_month: Number.parseInt(expiryDate.split("/")[0]),
              exp_year: Number.parseInt(expiryDate.split("/")[1]),
              cvc: cvc,
            },
            billing_details: {
              name: nameOnCard,
            },
          },
        }),
      })

      if (!confirmPaymentResponse.ok) {
        const errorData = await confirmPaymentResponse.json()
        throw new Error(errorData.error || "Payment confirmation failed")
      }

      const confirmData = await confirmPaymentResponse.json()

      if (confirmData.success) {
        setPaymentStatus("success")
        setPaymentMessage("Payment successful! Redirecting...")
        setTimeout(onPaymentSuccess, 1500) // Call success callback after a short delay
      } else {
        setPaymentStatus("error")
        setPaymentMessage(confirmData.message || "Payment failed. Please try again.")
      }
    } catch (error: any) {
      setPaymentStatus("error")
      setPaymentMessage(error.message || "An unexpected error occurred.")
      console.error("Payment error:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white p-6 rounded-lg shadow-lg">
        <DialogHeader className="flex justify-between items-center border-b pb-3 mb-4">
          <DialogTitle className="text-2xl font-bold">Purchase {magazine.title}</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="text-center text-lg font-semibold">Total: ₹{magazine.price.toFixed(2)}</div>
          <div className="grid gap-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="XXXX XXXX XXXX XXXX"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="expiryDate">Expiry Date (MM/YY)</Label>
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
                placeholder="CVC"
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
          <Button
            onClick={handlePayment}
            disabled={paymentStatus === "processing"}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            {paymentStatus === "processing" ? "Processing..." : `Pay ₹${magazine.price.toFixed(2)}`}
          </Button>
          {paymentMessage && (
            <p className={`text-center mt-2 ${paymentStatus === "error" ? "text-red-500" : "text-green-500"}`}>
              {paymentMessage}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

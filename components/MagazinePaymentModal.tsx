"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, CreditCard, Lock } from "lucide-react"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { getStripe } from "@/lib/stripe"

interface Magazine {
  id: number
  title: string
  price: number
  cover_image_url: string
  description?: string
}

interface MagazinePaymentModalProps {
  isOpen: boolean
  onClose: () => void
  magazine: Magazine | null
  onSuccess: () => void
}

const stripePromise = getStripe()

const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
}

function PaymentForm({
  magazine,
  onClose,
  onSuccess,
}: { magazine: Magazine; onClose: () => void; onSuccess: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    if (!email || !name) {
      setError("Please fill in all required fields")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Create payment intent
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: magazine.price,
          currency: "usd",
          magazineId: magazine.id,
          customerEmail: email,
        }),
      })

      const { clientSecret, error: intentError } = await response.json()

      if (intentError) {
        throw new Error(intentError)
      }

      // Confirm payment
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        throw new Error("Card element not found")
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name,
            email,
          },
        },
      })

      if (confirmError) {
        throw new Error(confirmError.message)
      }

      if (paymentIntent?.status === "succeeded") {
        // Confirm payment on server
        const confirmResponse = await fetch("/api/confirm-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
          }),
        })

        const confirmResult = await confirmResponse.json()

        if (confirmResult.success) {
          alert(`Payment successful! You can now access ${magazine.title}`)
          onSuccess()
          onClose()
        } else {
          throw new Error(confirmResult.error || "Payment confirmation failed")
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>

        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <Label>Card Details *</Label>
          <div className="mt-2 p-3 border rounded-md">
            <CardElement options={cardElementOptions} />
          </div>
        </div>
      </div>

      {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">{error}</div>}

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-sm text-gray-500 flex items-center">
          <Lock className="w-4 h-4 mr-1" />
          Secured by Stripe
        </div>
        <div className="text-lg font-semibold">${magazine.price.toFixed(2)}</div>
      </div>

      <Button type="submit" disabled={!stripe || isProcessing} className="w-full" size="lg">
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Pay ${magazine.price.toFixed(2)}
          </>
        )}
      </Button>
    </form>
  )
}

export default function MagazinePaymentModal({ isOpen, onClose, magazine, onSuccess }: MagazinePaymentModalProps) {
  if (!magazine) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Purchase Magazine</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <img
                  src={magazine.cover_image_url || "/placeholder.svg?height=80&width=60"}
                  alt={magazine.title}
                  className="w-15 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{magazine.title}</h3>
                  {magazine.description && <p className="text-sm text-gray-600 mt-1">{magazine.description}</p>}
                  <p className="text-lg font-bold text-green-600 mt-2">${magazine.price.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Elements stripe={stripePromise}>
            <PaymentForm magazine={magazine} onClose={onClose} onSuccess={onSuccess} />
          </Elements>
        </div>
      </DialogContent>
    </Dialog>
  )
}

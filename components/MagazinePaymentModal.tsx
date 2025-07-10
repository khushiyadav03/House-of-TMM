"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, CreditCard, Loader2 } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import type { Magazine } from "@/lib/supabase"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface MagazinePaymentModalProps {
  magazine: Magazine
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const PaymentForm = ({
  magazine,
  onClose,
  onSuccess,
}: {
  magazine: Magazine
  onClose: () => void
  onSuccess: () => void
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [email, setEmail] = useState("")
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState("")

  useEffect(() => {
    if (email && email.includes("@")) {
      createPaymentIntent()
    }
  }, [email, magazine.id])

  const createPaymentIntent = async () => {
    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          magazine_id: magazine.id,
          user_email: email,
        }),
      })

      const data = await response.json()

      if (data.error) {
        if (data.existing_purchase) {
          setError("You have already purchased this magazine")
        } else {
          setError(data.error)
        }
        return
      }

      setClientSecret(data.client_secret)
      setError(null)
    } catch (err) {
      setError("Failed to initialize payment")
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements || !clientSecret) {
      return
    }

    setProcessing(true)
    setError(null)

    const cardElement = elements.getElement(CardElement)

    if (!cardElement) {
      setError("Card element not found")
      setProcessing(false)
      return
    }

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          email: email,
        },
      },
    })

    if (stripeError) {
      setError(stripeError.message || "Payment failed")
      setProcessing(false)
    } else if (paymentIntent?.status === "succeeded") {
      // Confirm payment on server
      try {
        const response = await fetch("/api/confirm-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payment_intent_id: paymentIntent.id,
          }),
        })

        const data = await response.json()

        if (data.success) {
          onSuccess()
          onClose()
        } else {
          setError(data.error || "Failed to confirm purchase")
        }
      } catch (err) {
        setError("Failed to confirm purchase")
      }
      setProcessing(false)
    }
  }

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
          placeholder="your@email.com"
        />
      </div>

      {email && email.includes("@") && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <CreditCard className="inline w-4 h-4 mr-1" />
            Card Details
          </label>
          <div className="p-3 border border-gray-300 rounded-md">
            <CardElement options={cardElementOptions} />
          </div>
        </div>
      )}

      {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">{error}</div>}

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          disabled={processing}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing || !clientSecret || !email}
          className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {processing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay ₹${magazine.price}`
          )}
        </button>
      </div>
    </form>
  )
}

export default function MagazinePaymentModal({ magazine, isOpen, onClose, onSuccess }: MagazinePaymentModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Purchase Magazine</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold">{magazine.title}</h3>
          <p className="text-gray-600 text-sm">{magazine.description}</p>
          <p className="text-2xl font-bold text-green-600 mt-2">₹{magazine.price}</p>
        </div>

        <Elements stripe={stripePromise}>
          <PaymentForm magazine={magazine} onClose={onClose} onSuccess={onSuccess} />
        </Elements>

        <div className="mt-4 text-xs text-gray-500 text-center">
          <div className="flex items-center justify-center space-x-2">
            <span>🔒 Secure payment powered by Stripe</span>
          </div>
          <p className="mt-1">Your payment information is encrypted and secure</p>
        </div>
      </div>
    </div>
  )
}

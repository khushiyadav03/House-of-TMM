"use client"

import { useState, useEffect } from "react"
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

interface RazorpayPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  magazine: Magazine
  onPaymentSuccess: (magazineId: number) => void
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function RazorpayPaymentModal({
  isOpen,
  onClose,
  magazine,
  onPaymentSuccess,
}: RazorpayPaymentModalProps) {
  const [email, setEmail] = useState("")
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const { toast } = useToast()

  // Load Razorpay script when component mounts
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
      })
    }

    if (isOpen) {
      loadRazorpayScript()
    }
  }, [isOpen])

  const handlePayment = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to continue.",
        variant: "destructive",
      })
      return
    }

    setPaymentProcessing(true)
    try {
      // Step 1: Create Razorpay Order
      const orderResponse = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          magazineId: magazine.id,
          userEmail: email,
          amount: magazine.price * 100, // Convert to paisa
        }),
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok) {
        throw new Error(orderData.error || "Failed to create payment order.")
      }

      // Step 2: Initialize Razorpay payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Replace with your actual Razorpay key ID
        amount: magazine.price * 100, // Amount in paisa
        currency: orderData.currency,
        name: "TMM India",
        description: `Purchase of ${magazine.title}`,
        order_id: orderData.id,
        handler: async function (response: any) {
          // Step 3: Verify payment
          try {
            const verifyResponse = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                magazineId: magazine.id,
                userEmail: email,
              }),
            })

            const verifyData = await verifyResponse.json()

            if (verifyResponse.ok && verifyData.success) {
              toast({
                title: "Payment Successful!",
                description: `You have successfully purchased ${magazine.title}.`,
                variant: "default",
              })
              onPaymentSuccess(magazine.id)
            } else {
              throw new Error("Payment verification failed.")
            }
          } catch (error: any) {
            toast({
              title: "Verification Failed",
              description: error.message || "There was an error verifying your payment.",
              variant: "destructive",
            })
          }
        },
        prefill: {
          email: email,
        },
        theme: {
          color: "#000000",
        },
        modal: {
          ondismiss: function() {
            setPaymentProcessing(false)
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment.",
        variant: "destructive",
      })
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
          <div className="text-center text-sm text-gray-500">
            <p>You will be redirected to Razorpay to complete your payment securely.</p>
          </div>
        </div>
        <Button onClick={handlePayment} disabled={paymentProcessing || !email}>
          {paymentProcessing ? "Processing..." : `Pay Now ₹${magazine.price.toFixed(2)}`}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
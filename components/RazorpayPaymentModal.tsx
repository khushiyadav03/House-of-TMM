"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CreditCard, Shield, CheckCircle } from "lucide-react"

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

interface RazorpayResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
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
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [loadingScript, setLoadingScript] = useState(false)
  const { toast } = useToast()

  // Load Razorpay script when component mounts
  useEffect(() => {
    if (!isOpen) {
      setScriptLoaded(false)
      setEmail("")
      return
    }

    const loadRazorpayScript = async () => {
      // Check if script is already loaded
      if (typeof window !== 'undefined' && window.Razorpay) {
        setScriptLoaded(true)
        return
      }

      setLoadingScript(true)
      try {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true

        const scriptLoaded = new Promise<boolean>((resolve) => {
          script.onload = () => resolve(true)
          script.onerror = () => resolve(false)
        })

        document.body.appendChild(script)
        const loaded = await scriptLoaded
        
        // Small delay to ensure script is fully initialized
        await new Promise(resolve => setTimeout(resolve, 100))
        
        setScriptLoaded(loaded && !!(window as any).Razorpay)
      } catch (error) {
        console.error('Failed to load Razorpay script:', error)
        setScriptLoaded(false)
      } finally {
        setLoadingScript(false)
      }
    }

    loadRazorpayScript()
  }, [isOpen])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handlePayment = async () => {
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to continue.",
        variant: "destructive",
      })
      return
    }

    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    if (!scriptLoaded) {
      toast({
        title: "Payment System Loading",
        description: "Please wait for the payment system to load and try again.",
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
          userEmail: email.trim(),
          amount: magazine.price * 100, // Convert to paisa
        }),
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok) {
        console.error('Order creation failed:', orderData)
        const errorMessage = orderData.details 
          ? `${orderData.error}: ${orderData.details}`
          : orderData.error || "Failed to create payment order."
        throw new Error(errorMessage)
      }

      // Validate Razorpay key
      const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
      if (!razorpayKeyId) {
        throw new Error("Payment system configuration error. Please contact support.")
      }

      // Step 2: Initialize Razorpay payment
      const options = {
        key: razorpayKeyId,
        amount: magazine.price * 100, // Amount in paisa
        currency: orderData.currency || 'INR',
        name: "TMM India",
        description: `Purchase of ${magazine.title}`,
        order_id: orderData.id,
        handler: async function (response: RazorpayResponse) {
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
                userEmail: email.trim(),
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
              onClose() // Close modal on success
            } else {
              throw new Error(verifyData.error || "Payment verification failed.")
            }
          } catch (error: any) {
            console.error('Payment verification error:', error)
            toast({
              title: "Verification Failed",
              description: error.message || "There was an error verifying your payment.",
              variant: "destructive",
            })
          } finally {
            setPaymentProcessing(false)
          }
        },
        prefill: {
          email: email.trim(),
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
      console.error('Payment initiation error:', error)
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
      <DialogContent className="sm:max-w-[500px] bg-white border-0 shadow-2xl">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Purchase {magazine.title}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Complete your secure payment for ₹{magazine.price.toFixed(2)}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-6">
          {/* Magazine Preview */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-16 h-20 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
              {magazine.cover_image_url ? (
                <img 
                  src={magazine.cover_image_url} 
                  alt={magazine.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-gray-500">Cover</span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{magazine.title}</h3>
              <p className="text-sm text-gray-600">Digital Magazine</p>
              <p className="text-lg font-bold text-gray-900">₹{magazine.price.toFixed(2)}</p>
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@example.com"
              className="h-12 border-gray-300 focus:border-black focus:ring-black"
              disabled={paymentProcessing || loadingScript}
            />
            <p className="text-xs text-gray-500">
              Receipt and access details will be sent to this email
            </p>
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Secure Payment</p>
                <p className="text-xs text-blue-700 mt-1">
                  Your payment will be processed securely through Razorpay. We don't store your card details.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Features */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center space-y-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span className="text-xs text-gray-600">Instant Access</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Shield className="w-6 h-6 text-blue-500" />
              <span className="text-xs text-gray-600">Secure Payment</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <CreditCard className="w-6 h-6 text-purple-500" />
              <span className="text-xs text-gray-600">All Cards Accepted</span>
            </div>
          </div>

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={paymentProcessing || loadingScript || !scriptLoaded || !email.trim()}
            className="w-full h-12 bg-black hover:bg-gray-800 text-white font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingScript ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading Payment System...
              </span>
            ) : paymentProcessing ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing Payment...
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Pay Now ₹{magazine.price.toFixed(2)}
              </span>
            )}
          </Button>

          {/* Cancel Button */}
          <Button
            variant="outline"
            onClick={onClose}
            disabled={paymentProcessing}
            className="w-full h-10 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CreditCard, Mail, User, Phone, Lock } from "lucide-react"
import { Magazine } from "@/types"
import { useToast } from "@/hooks/use-toast"


interface GuestCheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  magazine: Magazine
  onPaymentSuccess: (magazineId: number) => void
}

interface UserDetails {
  name: string
  email: string
  phone: string
  password: string
}

interface RazorpayResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayInstance {
  open(): void;
  close(): void;
}

export default function GuestCheckoutModal({
  isOpen,
  onClose,
  magazine,
  onPaymentSuccess,
}: GuestCheckoutModalProps) {
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: "",
    email: "",
    phone: "",
    password: ""
  })
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [scriptReady, setScriptReady] = useState(false)

  const { toast } = useToast()

  // Load Razorpay script when dialog opens
  useEffect(() => {
    if (!isOpen) {
      setScriptReady(false)
      setUserDetails({ name: "", email: "", phone: "", password: "" })
      return
    }

    let cancelled = false
    const ensureScript = async () => {
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        if (!cancelled) setScriptReady(true)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true

      const scriptLoaded = new Promise<boolean>((resolve) => {
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
      })

      document.body.appendChild(script)
      const loaded = await scriptLoaded
      await new Promise((r) => setTimeout(r, 100))

      if (!cancelled) setScriptReady(loaded && !!(window as any).Razorpay)
    }
    ensureScript()
    return () => { cancelled = true }
  }, [isOpen])

  const validateDetails = () => {
    if (!userDetails.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your full name.",
        variant: "destructive",
      })
      return false
    }

    if (!userDetails.email.includes('@') || !userDetails.email.includes('.')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return false
    }

    if (!userDetails.phone.trim() || userDetails.phone.length < 10) {
      toast({
        title: "Invalid Phone",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      })
      return false
    }

    if (userDetails.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const createAccountAndProceed = async () => {
    if (!validateDetails()) return

    setPaymentProcessing(true)
    try {
      // Proceed directly to payment - account will be created after successful payment
      await proceedToPayment()
    } catch (error: any) {
      console.error('Payment initiation error:', error)
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to initiate payment. Please try again.",
        variant: "destructive",
      })
      setPaymentProcessing(false)
    }
  }

  const proceedToPayment = async () => {
    try {
      if (!scriptReady || typeof window === 'undefined' || !window.Razorpay) {
        throw new Error("Payment system is not ready yet. Please wait a moment and try again.")
      }

      // Step 1: Create Razorpay Order for guest user
      const orderResponse = await fetch("/api/razorpay/guest-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          magazineId: magazine.id,
          amount: magazine.price * 100,
          userDetails: userDetails,
        }),
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok) {
        throw new Error(orderData.error || "Failed to create payment order.")
      }

      // Step 2: Initialize Razorpay payment
      const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
      if (!razorpayKeyId) {
        throw new Error("Razorpay key ID is not configured. Please contact support.")
      }

      const options: RazorpayOptions = {
        key: razorpayKeyId,
        amount: magazine.price * 100,
        currency: orderData.currency,
        name: "TMM India",
        description: `Purchase of ${magazine.title}`,
        order_id: orderData.id,
        handler: async function (response: RazorpayResponse) {
          try {
            const verifyResponse = await fetch("/api/razorpay/guest-verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                magazineId: magazine.id,
                userDetails: userDetails,
              }),
            })

            const verifyData = await verifyResponse.json()

            if (verifyResponse.ok && verifyData.success) {
              toast({
                title: "Payment Successful!",
                description: `Welcome to TMM India! You have successfully purchased ${magazine.title}.`,
                variant: "default",
              })
              onPaymentSuccess(magazine.id)
            } else {
              throw new Error("Payment verification failed.")
            }
          } catch (error: unknown) {
            toast({
              title: "Verification Failed",
              description: (error as Error).message || "There was an error verifying your payment.",
              variant: "destructive",
            })
          } finally {
            setPaymentProcessing(false)
          }
        },
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.phone,
        },
        theme: {
          color: "#000000",
        },
        modal: {
          ondismiss: function () {
            setPaymentProcessing(false)
          }
        }
      }

      // Open Razorpay payment gateway
      const razorpay = new window.Razorpay(options)
      razorpay.open()

    } catch (error: unknown) {
      toast({
        title: "Payment Failed",
        description: (error as Error).message || "There was an error processing your payment.",
        variant: "destructive",
      })
      setPaymentProcessing(false)
    }
  }

  const handleInputChange = (field: keyof UserDetails, value: string) => {
    setUserDetails(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white border-0 shadow-2xl">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-xl font-bold text-gray-900">
            Complete Your Purchase
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Create your account and purchase <span className="font-semibold">{magazine.title}</span> for ₹{magazine.price.toFixed(2)}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-6">
          {/* Magazine Preview */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-16 h-20 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
              <span className="text-xs text-gray-500">Cover</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{magazine.title}</h3>
              <p className="text-sm text-gray-600">Digital Magazine</p>
              <p className="text-lg font-bold text-gray-900">₹{magazine.price.toFixed(2)}</p>
            </div>
          </div>

          {/* User Details Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  value={userDetails.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="pl-10 h-12 border-gray-300 focus:border-black focus:ring-black"
                  disabled={paymentProcessing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={userDetails.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@example.com"
                  className="pl-10 h-12 border-gray-300 focus:border-black focus:ring-black"
                  disabled={paymentProcessing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  value={userDetails.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+91 9876543210"
                  className="pl-10 h-12 border-gray-300 focus:border-black focus:ring-black"
                  disabled={paymentProcessing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Create Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={userDetails.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Create a secure password"
                  className="pl-10 h-12 border-gray-300 focus:border-black focus:ring-black"
                  disabled={paymentProcessing}
                />
              </div>
              <p className="text-xs text-gray-500">
                Your account will be created for future purchases
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">🔒</span>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Secure Payment & Account</p>
                <p className="text-xs text-blue-700 mt-1">
                  Your payment will be processed securely through Razorpay. An account will be created for future purchases.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <Button
            onClick={createAccountAndProceed}
            disabled={paymentProcessing || !scriptReady}
            className="w-full h-12 bg-black hover:bg-gray-800 text-white font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {paymentProcessing ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating Account & Processing Payment...
              </span>
            ) : !scriptReady ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading Payment System...
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Create Account & Pay ₹{magazine.price.toFixed(2)}
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
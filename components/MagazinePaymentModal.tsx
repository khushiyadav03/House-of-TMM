"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, CreditCard, Lock } from "lucide-react"

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

export default function MagazinePaymentModal({ isOpen, onClose, magazine, onSuccess }: MagazinePaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")

  if (!magazine) return null

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!email || !name || !cardNumber || !expiryDate || !cvv) {
      setError("Please fill in all required fields")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // For demo purposes, always succeed
      alert(`Payment successful! You can now access ${magazine.title}`)
      onSuccess()
      onClose()
    } catch (err) {
      setError("Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

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
                  <p className="text-lg font-bold text-green-600 mt-2">₹{magazine.price}</p>
                </div>
              </div>
            </CardContent>
          </Card>

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
                <Label htmlFor="cardNumber">Card Number *</Label>
                <Input
                  id="cardNumber"
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date *</Label>
                  <Input
                    id="expiryDate"
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV *</Label>
                  <Input
                    id="cvv"
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                    required
                  />
                </div>
              </div>
            </div>

            {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">{error}</div>}

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-gray-500 flex items-center">
                <Lock className="w-4 h-4 mr-1" />
                Secured Payment
              </div>
              <div className="text-lg font-semibold">₹{magazine.price}</div>
            </div>

            <Button type="submit" disabled={isProcessing} className="w-full" size="lg">
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay ₹{magazine.price}
                </>
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

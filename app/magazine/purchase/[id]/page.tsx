"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "../../../../lib/supabase"
import RazorpayPaymentModal from "../../../../components/RazorpayPaymentModal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ShoppingCart, Lock } from "lucide-react"

interface Magazine {
  id: number
  title: string
  issue_date: string
  cover_image_url: string
  pdf_url: string
  price: number
  is_paid: boolean
}

export default function MagazinePurchasePage() {
  const { id } = useParams()
  const router = useRouter()
  const [magazine, setMagazine] = useState<Magazine | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [hasPurchased, setHasPurchased] = useState(false)

  useEffect(() => {
    checkAuthAndFetchMagazine()
  }, [id])

  const checkAuthAndFetchMagazine = async () => {
    try {
      // Check authentication
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        // Redirect to login if not authenticated
        router.push(`/auth/login?redirect=/magazine/purchase/${id}`)
        return
      }
      
      setUser(user)

      // Fetch magazine details
      const response = await fetch(`/api/magazines/${id}`)
      if (!response.ok) {
        throw new Error('Magazine not found')
      }
      
      const magazineData = await response.json()
      setMagazine(magazineData)

      // Check if user has already purchased this magazine
      const purchaseResponse = await fetch(`/api/magazines/${id}/check-purchase`)
      if (purchaseResponse.ok) {
        const purchaseData = await purchaseResponse.json()
        if (purchaseData.purchased) {
          setHasPurchased(true)
          // Redirect to magazine view if already purchased
          router.push(`/magazine/view/${id}`)
          return
        }
      }

      // If magazine is free, redirect to view
      if (!magazineData.is_paid) {
        router.push(`/magazine/view/${id}`)
        return
      }

    } catch (error) {
      console.error('Error:', error)
      router.push('/magazine')
    } finally {
      setLoading(false)
    }
  }

  const handlePurchaseClick = () => {
    setIsPaymentModalOpen(true)
  }

  const handlePaymentSuccess = (magazineId: number) => {
    setIsPaymentModalOpen(false)
    // Redirect to magazine view after successful payment
    router.push(`/magazine/view/${magazineId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading magazine details...</p>
        </div>
      </div>
    )
  }

  if (!magazine || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Magazine not found or access denied.</p>
          <Button 
            onClick={() => router.push('/magazine')} 
            className="mt-4"
          >
            Back to Magazines
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <ShoppingCart className="h-12 w-12 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Complete Your Purchase</CardTitle>
            <p className="text-gray-600">You're about to purchase this magazine</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Magazine Preview */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-20 h-28 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                {magazine.cover_image_url ? (
                  <img 
                    src={magazine.cover_image_url} 
                    alt={magazine.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                    Cover
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900">{magazine.title}</h3>
                <p className="text-sm text-gray-600">Issue Date: {magazine.issue_date}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">₹{magazine.price.toFixed(2)}</p>
              </div>
            </div>

            {/* User Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Lock className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Secure Purchase</span>
              </div>
              <p className="text-sm text-blue-700">
                Logged in as: <strong>{user.email}</strong>
              </p>
              <p className="text-xs text-blue-600 mt-1">
                After purchase, you'll have lifetime access to this magazine.
              </p>
            </div>

            {/* Purchase Button */}
            <Button
              onClick={handlePurchaseClick}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Purchase Now - ₹{magazine.price.toFixed(2)}
            </Button>

            {/* Back Button */}
            <Button
              variant="outline"
              onClick={() => router.push('/magazine')}
              className="w-full"
            >
              Back to Magazines
            </Button>
          </CardContent>
        </Card>

        {/* Payment Modal */}
        {magazine && (
          <RazorpayPaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            magazine={magazine}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    </div>
  )
}